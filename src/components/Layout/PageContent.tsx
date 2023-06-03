import { Flex } from "@chakra-ui/react";
import React from "react";

type PageContentProps = {
  children: React.ReactNode;
};

const PageContent: React.FC<PageContentProps> = ({ children }: any) => {
  return (
    <>
      <Flex justify="center"  padding="10px 0px">
        <Flex
       
          width="95%"
          maxWidth="860px"
          justify="center"
        >
          <Flex
            direction="column"
            width={{ base: "100%", md: "65%" }}
           
            mr={{base:0,md:6}}
          >
            {children[0 as keyof typeof children]}
          </Flex>
          <Flex
            display={{ base: "none", md: "flex" }}
            flexGrow={1}
           
          >
            {children[1 as keyof typeof children]}
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
export default PageContent;
