import React from "react";

export default () => {
	return (
		<iframe
			title="cq9iframe"
			src={process.env.REACT_APP_CQ9}
			id="cq9iframe"
			scrolling="no"
			allowtransparency="true"
			style={{ height: "100%", width: "100%" }}
		/>
    );
};
