import { Banner } from "@/components/home/banner"
import { CategoriesSection } from "@/components/home/categories-section"
import { FeaturedItems } from "@/components/home/featured-items"
import { WhyChooseUs } from "@/components/home/why-choose-us"

export default function Page() {
  return (
    <>
      <Banner />
      <FeaturedItems />
      <CategoriesSection />
      <WhyChooseUs />
    </>
  )
}
