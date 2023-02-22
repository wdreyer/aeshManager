import '../styles/globals.css';
import Head from 'next/head';
import Menu from '../components/Menu';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import users from '../reducers/users';

const store = configureStore({
  reducer: { users },
 });
 

function App({ Component, pageProps }) {

  
  return (
    
     <Provider store={store}>
      <Head>
        <title>Next.js App</title>
      </Head>
      <Menu />     
      <Component {...pageProps} />    
    </Provider>
  );
}

export default App;
