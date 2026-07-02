import { redirect } from "next/navigation";

// The site's single purpose is the QR menu — send visitors straight there.
export default function RootPage() {
  redirect("/menu");
}
