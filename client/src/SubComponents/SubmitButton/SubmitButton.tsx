import { Button, Spinner } from "react-bootstrap";
import "./SubmitButton.css";


function SubmitButton({ disabled, loading }: { disabled: boolean, loading: boolean }) {
  return (
    <Button className="submit-btn mt-5 mb-2" disabled={disabled} type="submit">
      {loading ? (
        <Spinner animation="border" size="sm" role="status" aria-hidden="true" />
      ) : ("Enregistrer")}
    </Button>
  )
}

export default SubmitButton;