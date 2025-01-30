'use client';

import SignupPage from './SignupPage';

export default function Page() {
  const handleSignupSuccess = () => {
    console.log('Inscription réussie !');
  };
  return <SignupPage  onSignupSuccess={handleSignupSuccess}/>;
}
