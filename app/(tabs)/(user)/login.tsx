import {View,Text,TextInput,Pressable} from 'react-native';
import { useEffect, useState } from "react";
import useUserStore from "src/stores/userStore";
import { showToast } from 'src/utils';

const LoginPage = () => {

  const {login,curUser} = useUserStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const {msg} = await login({eml:email,pwd:password});
    showToast(msg);
  }
  
  return (
    <View>
      <Text>Login</Text>
      <TextInput placeholder="email" onChangeText={(text)=>setEmail(text)} />
      <TextInput placeholder="password" onChangeText={(text)=>setPassword(text)} />
      <Pressable onPress={handleLogin}><Text>Login</Text></Pressable>
    </View>
  )
}
export default LoginPage;