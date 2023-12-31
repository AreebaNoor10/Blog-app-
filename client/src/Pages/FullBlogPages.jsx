// FullBlogPage.js
import React from "react";
import { useLocation } from "react-router-dom";
import { Grid, GridItem,Box,Heading} from '@chakra-ui/react'

function FullBlogPage() {
  const location = useLocation();
  const { title, content } = location.state || {};

  return (
    <Box ml={{ base: 0, md: 60 }} p="4">
    <Grid templateColumns='repeat(5, 1fr)' gap={4}>
      <GridItem colSpan={1}  />
      <GridItem colStart={2} colEnd={5} >
          <Heading  textAlign='center'>{title}</Heading>
          <Box className="blog-content" dangerouslySetInnerHTML={{ __html: content }} />  
      </GridItem>
      <GridItem colSpan={1}  />
    </Grid>
    </Box>
  );
}

export default FullBlogPage;
