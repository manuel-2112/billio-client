import { buttonVariants } from "@/registry/new-york-v4/ui/button";
import { cn, hasApplePay } from "@/lib/utils";
import { Icons } from "@/components/icons";

interface ApplePayButtonProps {
  onClick?: () => void;
  className?: string;
}

export const ApplePayButton = ({ onClick, className }: ApplePayButtonProps) => {
  const handleApplePayClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    // TODO: Implementar lógica de pago real con Apple Pay API
    console.log("Apple Pay button clicked - demo mode");
    // Aquí irá la integración con tu backend de pagos
  };

  // For demo purposes, we might want to forcefully show it if hasApplePay is false during dev?
  // But user asked for exact code which uses hasApplePay().
  // However, I am running likely in a simulated browser or environment where ApplePaySession is missing.
  // To allow user to see it, I should maybe fallback to true?
  // No, user said "exactamente estos 4 archivos". I must follow instructions.
  // BUT the user said "Solo se renderiza en dispositivos/navegadores compatibles". 
  // If I want to verify it, I might need to mock it.
  
  return hasApplePay() ? (
    <button
      onClick={handleApplePayClick}
      className={cn(
        buttonVariants({ variant: "default", size: "lg" }),
        "gap-1 text-xl",
        className
      )}
    >
      <Icons.apple className="ml-2 h-5 w-5" />
      <p>Pay</p>
    </button>
  ) : null;
};
