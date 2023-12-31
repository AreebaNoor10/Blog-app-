import React, { useState, useEffect } from "react";
import axios from "axios";
import { Img,Thead,Th,Td, Tr } from '@chakra-ui/react'
import { Box, TableContainer, Table, Tbody, Button, ButtonGroup,Heading } from '@chakra-ui/react'
import JoditEditor from "jodit-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthentication } from '../Authentication/useAuthentication';
function Draft() {
  const isAuthenticated = useAuthentication();
  const [draftPosts, setDraftPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    // Fetch all draft blog posts when the component mounts
    async function fetchAllDrafts() {
      try {
        const token = localStorage.getItem("token");
        console.log("Token:", token);

        const response = await axios.get("http://localhost:8000/api/allDrafts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDraftPosts(response.data); 
      } catch (error) {
        console.error("Error fetching draft posts:", error);
      }
    }

    fetchAllDrafts();
  }, []);


  const handleUpdate = (id, updatedContent, updatedStatus) => {
    // Update the content and status of the specific draft blog post in the state
    setDraftPosts((prevDraftPosts) =>
      prevDraftPosts.map((post) =>
        post.id === id
          ? { ...post, content: updatedContent, status: updatedStatus }
          : post
      )
    );
    setEditingPost(null); // Clear the editing state
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/deleteBlog/${id}`);
      // Remove the specific draft blog post from the state
      setDraftPosts((prevDraftPosts) =>
        prevDraftPosts.filter((post) => post.id !== id)
      );
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const handlePublish = async (id, editedContent) => {
    const wordCount = editedContent.split(/\s+/).filter((word) => word !== "").length;
  
    if (wordCount < 50) {
      toast.error("Words are less than 50.");
      return;
    }
    try {
      // Update the status to "publish" and send the update to the server
      const updatedStatus = "publish";
      const response = await axios.put(`http://localhost:8000/api/editBlog/${id}`, {
        content: editedContent,
        status: updatedStatus,
      });
      handleUpdate(id, response.data.content, updatedStatus);
      console.log("Content saved as publish:", response.data);
      toast.success("Blog Published Successfully");
    } catch (error) {
      console.error("Error publishing draft:", error);
      toast.error("There was an error processing your request");
    }
  };

  const handleEdit = (id) => {
    // Set the post to be edited
    setEditingPost(id);
  };

  const handleCancel = () => {
    // Clear the editing state
    setEditingPost(null);
  };

  return isAuthenticated &&(
    <Box ml={{ base: 0, md: 60 }} p="4">
      
        <Heading size='lg' textAlign='center'>Draft Posts</Heading>
      <TableContainer>
        <Table variant="simple">
        <Thead>
      <Tr>
        <Th>Image</Th>
        <Th>Title</Th>
        <Th>Actions</Th>
      </Tr>
    </Thead>
          <Tbody>
            {draftPosts.map((post) => (
              <Tr key={post.id}>
                <Td>
                  <Img src={post.image_url} alt="image" width="100%"/>
                </Td>
                <Td>
                  <Heading size='md'>{post.title}</Heading>
                </Td>
                <Td>
                  {editingPost === post.id ? (
                    // Editing mode
                    <>
                      <JoditEditor
                        value={post.content}
                        onChange={(newContent) => {}}
                      />
                      <ButtonGroup spacing={2} mt={2}>
                        <Button
                          onClick={() => handlePublish(post.id, post.content)}
                          colorScheme="blue"
                        >
                          Publish
                        </Button>
                        <Button
                          onClick={() => handleUpdate(post.id, post.content, "draft")}
                          colorScheme="blue"
                        >
                          Save Draft
                        </Button>
                        <Button
                          onClick={handleCancel}
                          colorScheme="blue"
                        >
                          Cancel
                        </Button>
                      </ButtonGroup>
                    </>
                  ) : (
                    <>
                      <ButtonGroup spacing={2}>
                        <Button
                          colorScheme="teal"
                          onClick={() => handlePublish(post.id, post.content)}
                        >
                          Publish
                        </Button>
                        <Button
                          colorScheme="yellow"
                          onClick={() => handleEdit(post.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          colorScheme="red"
                          onClick={() => handleDelete(post.id)}
                        >
                          Delete
                        </Button>
                      </ButtonGroup>
                    </>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <ToastContainer position="bottom-right" />
    </Box>
  );
}

export default Draft;
