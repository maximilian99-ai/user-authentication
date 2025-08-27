import { useContext, useState } from 'react';
import { Alert } from 'react-native';

import AuthContent from '../components/Auth/AuthContent';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { AuthContext } from '../store/auth-context';
import { createUser } from '../util/auth';
import { Credentials } from '../util/type';

function SignupScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  const authCtx = useContext(AuthContext);

  async function signupHandler({ email, password, confirmEmail, confirmPassword }: Credentials) {
    setIsAuthenticating(true);
    try {
      const token = await createUser(email, password);
      authCtx.authenticate(token);
    } catch (error: any) {
      const message = error.message || 'Could not create user, please check your input and try again later.';
      Alert.alert(
        'Authentication failed',
        message
      );
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Creating user..." />;
  }

  return <AuthContent isLogin={false} onAuthenticate={signupHandler} />;
}

export default SignupScreen;
