import { signIn, useSession } from 'next-auth/react';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

interface SubscribeButtonProps{
  priceId: string;
}

export function SubscribeButton ({priceId} : SubscribeButtonProps){
  const {data: session} = useSession();

  async function HandleSubscribe(){
  if(!session){
    signIn('google')
    return
  }
   
  try{
    const response = await api.post('/subscribe')

    const { sessionId } = response.data;

    const stripe = await getStripeJs()

    stripe.redirectToCheckout({ sessionId})
  }catch(err) {
    alert(err.message);
  }
   
  }
    return(
        <button
        type="button"
        onClick={HandleSubscribe}
        className={styles.SubscribeButton}
        >
          Subscribe
        </button>
    )
}