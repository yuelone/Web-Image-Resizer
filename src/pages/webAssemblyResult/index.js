import React from "react";

import Loading from "../../components/Loading";
import ImageField from "../../components/ImageField";

const WebAssemblyResult = ({ loading, adjustedWebAssemblyImage, adjustedWebAssemblySize, handleImageLoad }) => (
  <>
    {
      loading && !adjustedWebAssemblyImage
        ? <Loading />
        : <ImageField
          title="Adjusted WebAssembly Image"
          imageWidth={adjustedWebAssemblySize.width}
          imgeHeight={adjustedWebAssemblySize.height}
          image={adjustedWebAssemblyImage}
          imgeAlt="adjustedWebAssemblyImage"
          onLoad={(e) => handleImageLoad('webAssembly', e)}
        />
    }
  </>
);

export default WebAssemblyResult;
