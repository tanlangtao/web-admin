import React from "react";

export default () => {
	return (
		<iframe
			title="pgiframe"
			src={process.env.REACT_APP_PG}
			id="pgiframe"
			scrolling="no"
			allowtransparency="true"
			style={{ height: "100%", width: "100%" }}
		/>
    );
};
