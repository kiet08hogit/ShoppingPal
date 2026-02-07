import { SignIn } from "@clerk/clerk-react";

function ClerkLogin() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '80vh',
      padding: '20px'
    }}>
      <SignIn 
        routing="path" 
        path="/login"
        signUpUrl="/signup"
        redirectUrl="/"
      />
    </div>
  );
}

export default ClerkLogin;
