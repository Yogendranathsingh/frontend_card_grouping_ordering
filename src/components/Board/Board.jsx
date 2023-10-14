/* eslint-disable react/prop-types */
import Card from "../TicketCard/TicketCard";
import "./Board.css";
import { BsFillBarChartFill } from "react-icons/bs";
import { AiOutlinePlus, AiOutlineCheckCircle } from "react-icons/ai";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { IoEarthSharp } from "react-icons/io5";
function Board({ tickets, header }) {
    return (
        <div className="board-container">
            <div className="board-header">
                <div>
                    <div className="flex-gap">
                        <IoEarthSharp className="bg-color-status-icon" />
                        <p>{header}</p>
                        <span>{tickets.length}</span>
                    </div>
                </div>

                <div className="flex-gap">
                    <AiOutlinePlus className="bg-color-icon" />
                    <BiDotsHorizontalRounded className="bg-color-icon" />
                </div>
            </div>

            <div className="board-hero">
                {tickets.map((ticket) => {
                    return (
                        <Card
                            key={ticket.id}
                            id={ticket.id}
                            profileURL="data:image/png;base64,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"
                            status={ticket.status}
                            title={ticket.title}
                            tag={ticket.tag[0]}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default Board;
