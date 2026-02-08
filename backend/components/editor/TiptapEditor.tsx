'use client';
import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Youtube from '@tiptap/extension-youtube';
import Link from '@tiptap/extension-link';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useToast } from '../ui/Toast';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

type ModalType = 'youtube' | 'link' | null;

export const TiptapEditor: React.FC<TiptapEditorProps> = ({ content, onChange }) => {
  const { showToast } = useToast();
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  // Modal state
  const [modalType, setModalType] = useState<ModalType>(null);
  const [inputValue, setInputValue] = useState('');
  const [linkText, setLinkText] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Youtube.configure({
        controls: true,
        nocookie: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Color,
      TextStyle,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default');
    
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    
    if (!cloudName) {
      throw new Error('Cloudinary configuration missing');
    }

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  };

  // Handle image button click
  const handleImageClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      if (file.size > 10 * 1024 * 1024) {
        showToast('L\'image est trop grande (max 10MB)', 'error');
        return;
      }

      if (!file.type.startsWith('image/')) {
        showToast('Veuillez sélectionner une image', 'error');
        return;
      }

      setIsUploadingImage(true);
      showToast('Téléchargement de l\'image...', 'info');

      try {
        const url = await uploadImageToCloudinary(file);
        editor.chain().focus().setImage({ src: url }).run();
        showToast('Image ajoutée avec succès', 'success');
      } catch (error) {
        console.error('Upload error:', error);
        showToast('Erreur lors du téléchargement de l\'image', 'error');
      } finally {
        setIsUploadingImage(false);
      }
    };

    input.click();
  };

  // Handle modal submit
  const handleModalSubmit = () => {
    if (modalType === 'youtube' && inputValue) {
      editor.commands.setYoutubeVideo({
        src: inputValue,
        width: 640,
        height: 360,
      });
      showToast('Vidéo YouTube ajoutée', 'success');
    } else if (modalType === 'link' && inputValue) {
      if (linkText) {
        // Insert new link with text
        editor.chain().focus().insertContent(`<a href="${inputValue}">${linkText}</a>`).run();
      } else {
        // Set link on selected text
        editor.chain().focus().setLink({ href: inputValue }).run();
      }
      showToast('Lien ajouté', 'success');
    }
    
    closeModal();
  };

  const closeModal = () => {
    setModalType(null);
    setInputValue('');
    setLinkText('');
  };

  return (
    <>
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="bg-gray-100 border-b border-gray-300 p-2 flex flex-wrap gap-1">
          {/* Text Formatting */}
          <Button
            type="button"
            size="sm"
            variant={editor.isActive('bold') ? 'primary' : 'ghost'}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <strong>B</strong>
          </Button>
          <Button
            type="button"
            size="sm"
            variant={editor.isActive('italic') ? 'primary' : 'ghost'}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <em>I</em>
          </Button>
          <Button
            type="button"
            size="sm"
            variant={editor.isActive('strike') ? 'primary' : 'ghost'}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <s>S</s>
          </Button>

          <div className="w-px bg-gray-300 mx-1" />

          {/* Headings */}
          <Button
            type="button"
            size="sm"
            variant={editor.isActive('heading', { level: 1 }) ? 'primary' : 'ghost'}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          >
            H1
          </Button>
          <Button
            type="button"
            size="sm"
            variant={editor.isActive('heading', { level: 2 }) ? 'primary' : 'ghost'}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            H2
          </Button>
          <Button
            type="button"
            size="sm"
            variant={editor.isActive('heading', { level: 3 }) ? 'primary' : 'ghost'}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            H3
          </Button>

          <div className="w-px bg-gray-300 mx-1" />

          {/* Lists */}
          <Button
            type="button"
            size="sm"
            variant={editor.isActive('bulletList') ? 'primary' : 'ghost'}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            • Liste
          </Button>
          <Button
            type="button"
            size="sm"
            variant={editor.isActive('orderedList') ? 'primary' : 'ghost'}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            1. Liste
          </Button>

          <div className="w-px bg-gray-300 mx-1" />

          {/* Alignment */}
          <Button
            type="button"
            size="sm"
            variant={editor.isActive({ textAlign: 'left' }) ? 'primary' : 'ghost'}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
          >
            ←
          </Button>
          <Button
            type="button"
            size="sm"
            variant={editor.isActive({ textAlign: 'center' }) ? 'primary' : 'ghost'}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
          >
            ↔
          </Button>
          <Button
            type="button"
            size="sm"
            variant={editor.isActive({ textAlign: 'right' }) ? 'primary' : 'ghost'}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
          >
            →
          </Button>

          <div className="w-px bg-gray-300 mx-1" />

          {/* Media */}
          <Button 
            type="button" 
            size="sm" 
            variant="ghost" 
            onClick={handleImageClick}
            disabled={isUploadingImage}
          >
            {isUploadingImage ? '⏳ Upload...' : '🖼️ Image'}
          </Button>
          <Button 
            type="button" 
            size="sm" 
            variant="ghost" 
            onClick={() => setModalType('youtube')}
          >
            ▶️ YouTube
          </Button>
          <Button 
            type="button" 
            size="sm" 
            variant="ghost" 
            onClick={() => setModalType('link')}
          >
            🔗 Lien
          </Button>

          <div className="w-px bg-gray-300 mx-1" />

          {/* Color */}
          <input
            type="color"
            onInput={(e) =>
              editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()
            }
            value={editor.getAttributes('textStyle').color || '#000000'}
            className="w-8 h-8 rounded cursor-pointer"
          />

          <div className="w-px bg-gray-300 mx-1" />

          {/* Clear */}
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().unsetAllMarks().run()}
          >
            ✖ Effacer format
          </Button>
        </div>

        {/* Editor */}
        <div className="prose max-w-none p-4 min-h-[400px]">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Modal */}
      {modalType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {modalType === 'youtube' && 'Ajouter une vidéo YouTube'}
              {modalType === 'link' && 'Ajouter un lien'}
            </h3>

            <div className="space-y-4">
              {modalType === 'youtube' && (
                <Input
                  label="URL YouTube"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  autoFocus
                />
              )}

              {modalType === 'link' && (
                <>
                  <Input
                    label="URL du lien"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="https://example.com"
                    autoFocus
                  />
                  <Input
                    label="Texte du lien (optionnel)"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder="Cliquez ici"
                  />
                  <p className="text-sm text-gray-600">
                    💡 Astuce: Sélectionnez d'abord le texte dans l'éditeur, puis cliquez sur "🔗 Lien" pour transformer ce texte en lien.
                  </p>
                </>
              )}

              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={closeModal}
                >
                  Annuler
                </Button>
                <Button
                  type="button"
                  onClick={handleModalSubmit}
                  disabled={!inputValue}
                >
                  Ajouter
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};