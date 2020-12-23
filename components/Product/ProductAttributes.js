import React, { useState } from "react";
import { Header, Button, Modal } from "semantic-ui-react";
import axios from "axios";
import baseUrl from "../../utils/baseUrl";
import { useRouter } from "next/router";

function ProductAttributes({ description, _id, user }) {
  const [modal, setModal] = useState(false);
  const router = useRouter();
  const isRoot = user && user.role === "root";
  const isAdmin = user && user.role === "admin";

  const isRootOrAdmin = isRoot || isAdmin;

  function handleDelete() {
    const url = `${baseUrl}/api/product`;
    const payload = { params: { _id } };
    axios.delete(url, payload);
    router.push("/");
  }

  return (
    <>
      <Header as="h3">About this Product</Header>
      <p>{description}</p>
      {isRootOrAdmin && (
        <>
          <Button
            icon="trash alternate outline"
            color="red"
            content="Delete Product"
            onClick={() => setModal(true)}
            // onclick should be passed after the return function
            //  i.e. callback function so that it doesnot executes immediately
          />
          <Modal open={modal} dimmer="blurring">
            <Modal.Header>Confirm Delete</Modal.Header>
            <Modal.Content>
              Are you sure you want to delete this product
            </Modal.Content>
            <Modal.Actions>
              <Button content="cancel" onClick={() => setModal(false)} />
              <Button
                negative
                icon="trash"
                labelPosition="right"
                content="Delete"
                onClick={handleDelete}
              />
            </Modal.Actions>
          </Modal>
        </>
      )}
    </>
  );
}

export default ProductAttributes;
