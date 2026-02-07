import { SignUp } from "@clerk/clerk-react";

function ClerkSignup() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '80vh',
      padding: '20px'
    }}>
      <SignUp 
        routing="path" 
        path="/signup"
        signInUrl="/login"
        redirectUrl="/"
      />
    </div>
  );
}

export default ClerkSignup;
