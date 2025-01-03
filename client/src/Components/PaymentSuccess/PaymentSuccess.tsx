import { Container, Image } from 'react-bootstrap';
import Success from "../../photos/success.png";

function PaymentSuccess() {
  return (
    <section className="bg-light py-5">
        <Container>
            <h2 className="title display-5">Payment Succès</h2>
            <Image src={Success} />
        </Container>
    </section>
  )
}

export default PaymentSuccess;