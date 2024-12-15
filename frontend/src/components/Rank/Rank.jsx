import React, { useState, useEffect } from "react";
import "./Rank.css";
import { useSelector } from "react-redux";
import { selectUserEntries, selectUserName } from "@/redux/user/user.selectors";
import fetchRankMe from "@/utils/rank-me-helper";

const Rank = () => {
	const entries = useSelector(selectUserEntries);
	const name = useSelector(selectUserName);

	const [emoji, setEmoji] = useState("");

	useEffect(() => {
		generateEmoji(entries);
	}, [entries, name]);

	const generateEmoji = async (entries) => {
		try {
			if (Number(entries) === 0) {
				setEmoji("None");
				return;
			}

			const response = await fetchRankMe(entries, import.meta.env.VITE_PROD_BASE_URL);
			if (response.error) {
				setEmoji("😕");
				return;
			}
			setEmoji(response.input);
		} catch (error) {
			// Log the error to firestore
			await logToFirestore("Failed to get rank", "error", { error });
			setEmoji("😕");
		}
	};

	return (
		<div className="rankParent">
			<div className="rankText">{`${name}, your current entry count is...`}</div>
			<div className="rankNumber">{entries}</div>
			<div className="rankText">{`Rank Badge: ${emoji}`}</div>
			<div className="rankText">{`This App will detect faces in your photos. Give it a try.`}</div>
		</div>
	);
};

export default Rank;
