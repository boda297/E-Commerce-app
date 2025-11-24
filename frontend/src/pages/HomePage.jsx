import Hero from "../components/Layout/Hero";
import GenderCollectionSection from "../components/Products/GenderCollectionSection";
import FeatureSection from "../components/Products/FeatureSection";
import ProductSlider from "../components/Products/ProductSlider";
import { useEffect, useState } from "react";
import axios from "axios";

const HomePage = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [womenProducts, setWomenProducts] = useState([]);
  const [menProducts, setMenProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchTopWears = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/products`
        );

        if (isMounted) {
          const data = response.data;

          // Sort and get new arrivals
          const arrivals = [...data]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 10);

          // Filter by gender in one pass
          const women = [];
          const men = [];

          data.forEach((product) => {
            const gender = product.gender?.toLowerCase();
            if (gender === "women" || gender === "female") {
              women.push(product);
            } else if (gender === "men" || gender === "male") {
              men.push(product);
            }
          });

          setNewArrivals(arrivals);
          setWomenProducts(women);
          setMenProducts(men);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching top wears:", error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchTopWears();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Hero />
      <GenderCollectionSection />
      <div className="container mx-auto">
        <ProductSlider
          products={newArrivals}
          title="New Arrivals"
          isLoading={isLoading}
          path="collections/all"
        />
      </div>
      <div className="container mx-auto">
        <ProductSlider
          products={womenProducts}
          title="Top Wears for Women"
          isLoading={isLoading}
          path="collections/all?gender=Women"
        />
      </div>
      <div className="container mx-auto mt-4">
        <ProductSlider
          products={menProducts}
          title="Top Wears for Men"
          isLoading={isLoading}
          path="collections/all?gender=Men"
        />
      </div>
      <FeatureSection />
    </>
  );
};

export default HomePage;
