. Project Overview

This project is a real estate web platform for renting and selling apartments.

The platform allows:

Visitors to browse properties

Clients to pre-reserve rental properties

Clients to request to buy properties

Admins to manage listings, reservations, sale requests, ads, and blog content

The project targets the Moroccan real estate market and focuses on:

Professional appearance

SEO optimization

Lead generation

Monetization via ads

2. Main Actors
Visitor (not authenticated)

Browse properties

Search & filter properties

View property details

Pre-reserve rental properties (with or without account)

Read blog articles

Contact admin

User (authenticated client)

Register / Login

Pre-reserve rental properties

Request to buy properties

View personal reservations

View personal purchase requests

Admin

Manage properties (rent & sale)

Manage reservations

Manage sale requests

Manage hero section ads

Manage blog posts (SEO)

View statistics dashboard

3. Tech Stack (MANDATORY)
Frontend

Next.js

React

Tailwind CSS

SEO-first structure (SSR / metadata / clean URLs)

Backend

Node.js

Express.js

REST API

JWT authentication

Database

PostgreSQL

Relational design (no NoSQL)

4. Core Business Rules (VERY IMPORTANT)
Properties

A single properties table handles both rent and sale

Property type:

RENT

SALE

Property status:

DISPONIBLE

EN_COURS

VENDU

❌ Do NOT create separate tables for rent and sale properties

Reservations (Rental only)

Reservations apply ONLY to RENT properties

A reservation includes:

start date

end date

status (PENDING / CONFIRMED / CANCELLED)

Dates must not overlap for the same property

Calendar availability must be respected

❌ Sale properties must never use the reservations table

Sale Requests

Sale tracking is done via a bridge table between users and properties

Each request represents interest to buy

Multiple users can request the same property

Only one request can be marked as the final buyer

Statuses:

NEW

CONTACTED

WON (final buyer)

LOST

✔ This allows demand tracking and sales statistics

5. Authentication Rules

Only authenticated users can:

Request to buy

View personal history

Admin has exclusive access to:

Dashboard

CRUD operations

Ads

Blog

Statistics

6. SEO Rules (MANDATORY)

Server-side rendering where possible

Clean URLs (/properties/appartement-casablanca)

Meta titles & descriptions

Blog content for organic traffic

Fast loading & responsive design

7. Ads System

Ads appear in the Hero section

Admin can:

Add ads

Enable / disable ads

Ads include:

Image

Optional external link

8. UI / Design Principles

Professional real estate look

Minimal & clean layout

Focus on property images

Trustworthy color palette

Mobile-first & fully responsive

❌ No flashy or experimental UI
❌ No over-animations

9. Data Integrity Rules

No duplicated user information

Users must exist before:

Reserving

Requesting to buy

Deletions cascade safely

Business logic enforced in backend services

10. What the AI MUST NOT DO

❌ Split rent & sale into separate property tables

❌ Mix reservations with sales

❌ Introduce unnecessary complexity

❌ Change the agreed tech stack

❌ Ignore SEO constraints

11. Project Goal

Deliver a scalable, maintainable, and professional real estate platform that:

Supports rental & sales workflows

Helps admins manage business efficiently

Generates leads and revenue

Is SEO-ready from day one