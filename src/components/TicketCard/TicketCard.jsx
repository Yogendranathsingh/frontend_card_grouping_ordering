import { AiOutlineEllipsis } from "react-icons/ai";
import {  BsFillCircleFill } from "react-icons/bs";
import "./TicketCard.css";

const TicketCard = ({ id, profileURL, status, title, tag }) => {
    return (
        <div className="ticket-card-container border-curve">
            <div className="ticket-card-header">
                <p className="header-id">{id}</p>
                {profileURL ? (
                    <div className="ticket-avatar-container">
                        <div className="ticket-image-container">
                            <img
                                src={profileURL}
                                className="image"
                                alt="prosper-baba"
                            />
                        </div>

                        <span
                            className={`ticket-avatar-badge ${
                                status === true ? "available" : ""
                            }`}
                        ></span>
                    </div>
                ) : null}
            </div>
            <div className="ticket-card-hero">
                <div className="ticket-card-title">
                    <p>{title}</p>
                </div>

                <div className="ticket-tag-container">
                    <div className="alert-icon border-curve">
                        <AiOutlineEllipsis className="bg-color-icon" />
                    </div>
                    <div className="ticket-card-tag border-curve">
                        < BsFillCircleFill className="bg-color-icon is1" />
                        <p className="tag-text">{tag}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketCard;
