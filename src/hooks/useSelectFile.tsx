import React, { useState } from 'react';

type useSelectFileProps = {
    
};

const useSelectFile = () => {
    const [selectedFile, setSelectedFile] = useState<string>("");
     const onSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (event.target.files?.[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target?.result as string);
    };
  };

    return {
        selectedFile, setSelectedFile, onSelectFile
    }
}
export default useSelectFile;