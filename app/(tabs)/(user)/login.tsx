import {View,Text,TextInput,Pressable} from 'react-native';
import { useEffect, useState } from "react";
import useUserStore from "src/stores/userStore";

const LoginPage = () => {

  const {login,curUser} = useUserStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    await login({eml:email,pwd:password});
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