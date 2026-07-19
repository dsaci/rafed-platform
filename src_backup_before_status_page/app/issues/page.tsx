import { redirect } from 'next/navigation';

export default function IssuesRedirect() {
  // Redirect to the "submit new issue" page
  redirect('/issues/new');
}
