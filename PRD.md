# Product Requirements Document: Crowdfunding Platform

## 1. Product Overview

### 1.1 Product Definition

This product is a web-based crowdfunding platform that allows users to create and manage funding campaigns, and other users to contribute financially to these campaigns. The platform aims to connect creators with a community of backers to bring their ideas to life.

### 1.2 Target Audience

*   **Creators/Campaign Owners:** Individuals or groups with projects, ideas, or causes seeking financial support.
*   **Backers/Consumers:** Individuals interested in supporting various projects and causes, willing to contribute financially.

### 1.3 Core Purpose

To provide a simple, intuitive, and secure platform for users to launch and fund creative, innovative, or charitable projects.

## 2. Project Goals

*   **Goal 1:** Facilitate easy creation and management of funding campaigns.
*   **Goal 2:** Enable secure and straightforward financial contributions to campaigns.
*   **Goal 3:** Ensure a clear and consistent user experience across the platform.
*   **Goal 4:** Provide a basic but functional website that adheres to modern web standards.

## 3. Feature List

### 3.1 Must-Have Features

*   **Campaign Creation:**
    *   Users can create a new funding campaign post.
    *   Campaign creation requires setting a password for editing purposes.
    *   Campaign posts include a title, description, and target funding amount.
*   **Campaign Editing:**
    *   Campaign owners can edit their campaign posts.
    *   Editing requires entering the correct password associated with the campaign.
*   **Campaign Viewing:**
    *   All users can view active funding campaigns.
    *   Campaign pages display campaign details, current funding, and remaining time (if applicable).
*   **Funding Contribution:**
    *   Users can contribute a specified amount to a campaign.
    *   A prompt for payment method (for simulated payment) will appear.
    *   Confirmation of contribution will add a virtual amount to the campaign's total.

### 3.2 Should-Have Features

*   **Basic Search/Filtering:** Users can search for campaigns by title or category.
*   **User Profiles (basic):** Simple profiles for creators to showcase their other campaigns.
*   **Progress Bar:** Visual representation of funding progress on each campaign page.

### 3.3 Could-Have Features

*   **Comments Section:** Allow backers to leave comments on campaign pages.
*   **Social Sharing:** Options to share campaigns on social media.
*   **Campaign Categories:** Organize campaigns into different categories.

## 4. Technical and Design Requirements

### 4.1 Technology Stack

*   **Frontend:** HTML, CSS (Tailwind CSS for styling), JavaScript (React.js with Next.js for framework, Zustand for global state management, React Query for server state, react-hook-form for form handling, shadcn-ui for UI components).
*   **Backend:** Supabase (for database, authentication, and API).
*   **Package Manager:** npm
*   **Icons:** Lucide-react
*   **Date Handling:** date-fns
*   **Utility Functions:** es-toolkit
*   **Validation:** zod

### 4.2 UI/UX Guidelines

*   **Simplicity:** Clean and uncluttered interface.
*   **Responsiveness:** Mobile-first design, ensuring usability across devices.
*   **Accessibility:** Adherence to WCAG guidelines for inclusive design.
*   **Consistency:** Uniform design elements, typography, and color palette.
*   **Intuitive Navigation:** Easy-to-understand navigation for both creators and backers.
*   **Placeholder Images:** Use valid picsum.photos stock images for any placeholder image.

### 4.3 Integration Requirements

*   **Supabase Integration:** Seamless connection to Supabase for data storage and retrieval.
*   **Client Components:** All components must be client components (`"use client"` directive).
*   **Promise-based page props:** All `page.tsx` parameters should use promises.

## 5. Milestones

*   **Milestone 1 (Week 1):** Complete PRD and initial setup of the Next.js project with basic folder structure and Tailwind CSS integration.
*   **Milestone 2 (Week 2):** Implement static pages (Home, About, Contact) and basic navigation. Develop campaign creation form and functionality (without full Supabase integration).
*   **Milestone 3 (Week 3):** Integrate Supabase for campaign data storage and retrieval. Implement campaign viewing and editing functionalities with password protection.
*   **Milestone 4 (Week 4):** Implement funding contribution feature with simulated payment and update campaign totals. Refine UI/UX and ensure responsiveness.
*   **Milestone 5 (Week 5):** Final review, testing, and preparation for submission. Include GitHub repository link.
