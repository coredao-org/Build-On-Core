import { Button } from "@/components/ui/button";

export default function PayWithStripe() {
  return (
    <Button
      variant="outline"
      className="flex rounded-lg mt-3 items-center space-x-2"
    >
      <span>Pay with Stripe</span>
    </Button>
  );
}
