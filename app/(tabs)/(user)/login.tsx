import {View,Text,TextInput,Pressable, StyleSheet} from 'react-native';
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
    <View style={LoginFormStyle.container}>
      <Text style={LoginFormStyle.formTitle}>Welcome to Sam App</Text>
      <TextInput style={LoginFormStyle.textInput} placeholder="email" onChangeText={(text)=>setEmail(text)} />
      <TextInput style={LoginFormStyle.textInput} placeholder="password" onChangeText={(text)=>setPassword(text)} />
      <Pressable style={LoginFormStyle.formBtn} onPress={handleLogin}><Text style={LoginFormStyle.formBtnText}>Login</Text></Pressable>
    </View>
  )
}

const LoginFormStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10
  },
  formTitle : {
    fontSize: 24
  },
  textInput: {
    fontSize: 18,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  formBtn: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10
  },
  formBtnText: {
    fontSize: 20,
  }
});

export default LoginPage;