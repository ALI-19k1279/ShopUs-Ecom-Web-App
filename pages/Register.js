import React, { useContext, useEffect } from 'react';
import Layout from '../components/Layout';
import { useForm, Controller } from 'react-hook-form';
import NextLink from 'next/link';
import Form from '../components/Form';
import axios from 'axios';
import toast from 'react-hot-toast'
import jsCookie from 'js-cookie';
import { useRouter } from 'next/router';
import { Store } from '../utils/Store';
import { useStateContext} from '../context/StateContext';
import { getError } from '../utils/error';
import {
  Button,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from '@mui/material';



export default function RegisterScreen() {

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const router=useRouter()
  const {state,dispatch}=useStateContext()
  const {userInfo}=state;
  const { redirect } = router.query;
  useEffect(()=>{
    if(userInfo){
      router.push(redirect || '/');
    }
  },[router,userInfo])
  const submitHandler = async ({
    name,
    email,
    password,
    confirmPassword,
  }) => {
    if (password!=confirmPassword){
      toast.error('Passwords donot match');
      return
    }
    try{
      const{data}=await axios.post('api/Users/register',{
        name,email,password
      });
      dispatch({ type: 'USER_LOGIN', payload: data });
      jsCookie.set('userInfo', JSON.stringify(data));
      router.push(redirect || '/');
    }catch(err){
      toast.error(getError(err));
    }
  };
  return (
      <Form onSubmit={handleSubmit(submitHandler)}>
        <Typography component="h1" variant="h1">
          Register
        </Typography>
        <List>
          <ListItem>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="name"
                  label="Name"
                  inputProps={{ type: 'name' }}
                  error={Boolean(errors.name)}
                  helperText={
                    errors.name
                      ? errors.name.type === 'minLength'
                        ? 'Name length is more than 1'
                        : 'Name is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

          <ListItem>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="email"
                  label="Email"
                  inputProps={{ type: 'email' }}
                  error={Boolean(errors.email)}
                  helperText={
                    errors.email
                      ? errors.email.type === 'pattern'
                        ? 'Email is not valid'
                        : 'Email is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 6,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="password"
                  label="Password"
                  inputProps={{ type: 'password' }}
                  error={Boolean(errors.password)}
                  helperText={
                    errors.password
                      ? errors.password.type === 'minLength'
                        ? 'Password length is more than 5'
                        : 'Password is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="confirmPassword"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 6,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="confirmPassword"
                  label="Confirm Password"
                  inputProps={{ type: 'password' }}
                  error={Boolean(errors.confirmPassword)}
                  helperText={
                    errors.confirmPassword
                      ? errors.confirmPassword.type === 'minLength'
                        ? 'Confirm Password length is more than 5'
                        : 'Confirm Password is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Button variant="contained" type="submit" fullWidth color="error">
              Register
            </Button>
          </ListItem>
          <ListItem>
            Already have an account?{' '}
            <NextLink href={`/Login?redirect=${redirect || '/'}`} passHref>
              <Link>Login</Link>
            </NextLink>
          </ListItem>
        </List>
      </Form>
  );
}