import React, { useEffect, useState } from "react";
import {
  Form,
  Image,
  Button,
  Input,
  TextArea,
  Message,
  Header,
  Icon,
} from "semantic-ui-react";

import axios from "axios";
import baseUrl from "../utils/baseUrl";
import catchErrors from "../utils/catchErrors";

const INITIAL_PRODUCT = {
  name: "",
  price: "",
  media: "",
  description: "",
};

function CreateProduct() {
  const [product, setProduct] = useState(INITIAL_PRODUCT);
  const [mediaPreview, setMediaPreview] = useState("");
  const [success, SetSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const isProduct = Object.values(product).every((element) =>
      Boolean(element)
    );
    isProduct ? setDisabled(false) : setDisabled(true);
  }, [product]);

  function handleChange(event) {
    const { name, value, files } = event.target;
    // using updater attern to update the previous state
    if (name === "media") {
      setProduct((previousState) => ({ ...previousState, media: files[0] }));
      setMediaPreview(window.URL.createObjectURL(files[0]));
      // windows built in for making preview links
    } else {
      setProduct((previousState) => ({ ...previousState, [name]: value }));
      // console.log(product);
    }
  }

  async function handleImageUpload() {
    const data = new FormData();
    data.append("file", product.media);
    data.append("upload_preset", "react-reserve");
    data.append("cloud_name", "vatraiadarsh");
    const response = await axios.post(process.env.CLOUDINARY_URL, data);
    const mediaUrl = response.data.url;
    return mediaUrl;
  }

  async function handleSubmit(event) {
    try {
      event.preventDefault();
      setLoading(true);
      setError("");
      const mediaUrl = await handleImageUpload();
      console.log({ mediaUrl });
      const url = `${baseUrl}/api/product`;
      // const {name,price,description} = product
      const payload = { ...product, mediaUrl };
      const response = await axios.post(url, payload);
      console.log(response);
      setProduct(INITIAL_PRODUCT);
      SetSuccess(true);
    } catch (error) {
      catchErrors(error, setError);
      console.error("Error", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header as="h2" block>
        <Icon name="add circle" color="green" />
        Create New Product
      </Header>
      <Form
        success={success}
        error={Boolean(error)}
        loading={loading}
        onSubmit={handleSubmit}
      >
        <Message error header="Oops!" content={error} />
        <Message
          success
          icon="check"
          header="Success!"
          content="Your product have been Posted"
        />
        <Form.Group widths="equal">
          <Form.Field
            control={Input}
            name="name"
            label="Name"
            placeholder="Name"
            value={product.name}
            onChange={handleChange}
          />

          <Form.Field
            control={Input}
            name="price"
            label="Price"
            placeholder="Price"
            min="0.00"
            step="0.01"
            type="number"
            value={product.price}
            onChange={handleChange}
          />

          <Form.Field
            control={Input}
            name="media"
            type="file"
            label="Media"
            accept="image/*"
            content="Select Image"
            onChange={handleChange}
          />
        </Form.Group>
        <Image src={mediaPreview} rounded centered size="small" />

        <Form.Field
          control={TextArea}
          name="description"
          label="Description"
          placeholder="Description"
          value={product.description}
          onChange={handleChange}
        />

        <Form.Field
          control={Button}
          color="blue"
          icon="pencil alternate"
          content="Submit"
          type="Submit"
          disabled={disabled || loading}
        />
      </Form>
    </>
  );
}

export default CreateProduct;
