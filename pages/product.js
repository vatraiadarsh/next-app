import axios from "axios";
import ProductSummary from "../components/Product/ProductSummary";
import ProductAttributes from "../components/Product/ProductAttributes";
import baseUrl from "../utils/baseUrl";


function Product({product, user}) {
  // console.log(product);
 return(
  <>
  <ProductSummary {...product} user={user} />
  <ProductAttributes {...product} user={user} />
  </>
 )
  
}

// note we are getting this props as we have passed contect ctx in pageprops because we can use
// useRouter only in the functional components not inside get initial props
Product.getInitialProps = async ({ query: { _id } }) => {
  // console.log(_id);
  // const url = `http://localhost:3000/api/product?_id=${_id}`;
  // console.log(ctx);
  const url = `${baseUrl}/api/product`;
  const payload = { params: { _id } };
  const response = await axios.get(url, payload);
  return {product:response.data};
};

export default Product;
