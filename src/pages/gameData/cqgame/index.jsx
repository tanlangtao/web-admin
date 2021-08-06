import React from "react";

export default () => {
	return (
		<iframe
			title="agiframe"
			src={process.env.REACT_APP_CQ9}
			id="agiframe"
			scrolling="no"
			allowtransparency="true"
			style={{ height: "100%", width: "100%" }}
		/>
    );
};
