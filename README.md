# PLP Learning Attempts Viewer

A Next.js + Supabase web app for viewing Personalized Learning Platform (PLP) module attempt records.

---

## Setup Steps

1. **Supabase Project**
    - Created a Supabase project.
    - Made a `plp_learning_attempts` table and the `get_plp_attempts` function (SQL RPC).
    - Added sample data for testing by using insert statements in the Supabase SQL editor.
    - Tested the function by querying for specific emails to confirm results.

2. **Frontend App**
    - Read Supabase documentation to learn best practices how to generate a Next.js app with the `with-supabase` template.
    - Used AMP in VS Code to make the UI, connect to Supabase, and call the RPC function.
    - Also used AMP to create a form to input email, fetch attempts, and display results in a table.

---

## What I Learned

- **PostgreSQL syntax is different from normal SQL.**
  - Used AI to adapt my SQL queries for PostgreSQL and ensure functions work.
- **Connected Supabase directly to my React components.**
  - Learned the flow for querying Supabase RPCs within React and updating the UI with results.

---

## Anything That Surprised Me

- **No major surprises.**
  - The flow of the whole project, from database setup to UI, was easier than expected because of AI making the process straightforward by not requiring extensive knowledge of PostgreSQL or knowing how to connect to Supabase directly from React components and call functions in supabase and display them in Next.js.

---# PLP-Attempts-Viewer
