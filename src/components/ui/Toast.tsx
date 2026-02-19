import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="system"
      richColors
      position="top-right"
      closeButton
      {...props}
      style={{
        fontFamily: '"Amazon Ember", Arial, sans-serif',
      }}
    />
  );
};
