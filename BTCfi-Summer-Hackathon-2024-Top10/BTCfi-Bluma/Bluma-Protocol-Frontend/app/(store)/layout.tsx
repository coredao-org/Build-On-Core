import Footer from "@/components/shared/footer";
import MaxWrapper from "@/components/shared/max-wrapper";

export default function MarketLayout({ children }: ILayout) {
  return (
    <MaxWrapper className="flex-1 flex flex-col">
      <main className="flex-1 pt-8 pb-16 px-4 md:px-0">{children}</main>
    </MaxWrapper>
  );
}
