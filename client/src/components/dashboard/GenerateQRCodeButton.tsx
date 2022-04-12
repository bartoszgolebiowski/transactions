import { LinkIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import * as React from "react";
import QRCode from "react-qr-code";

type Props = {
  requestId: string;
};

const GenerateQRCodeButton = (props: Props) => {
  const { requestId } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDownload = () => {
    const svg = document.getElementById(requestId);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "QRCode";
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Download QRCode</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box display="grid" placeItems="center">
              <QRCode id={requestId} value={requestId} />
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={handleDownload}>
              Download
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Button onClick={onOpen}>
        <LinkIcon />
      </Button>
    </>
  );
};

export default GenerateQRCodeButton;
