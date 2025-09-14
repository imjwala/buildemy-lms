
export type ApiResponse = {
  status: "success" | "error";
  message?: string;
  html?: string; 
  checkoutUrl?: string;
  [key: string]: any;
};
