import { useState } from "react";
import Board from "./components/Board/Board";
import { GroupingList, OrderingList, priorityMap } from "./data/data";
import { AiOutlineMenu } from "react-icons/ai";

import "./App.css";

import { useEffect } from "react";
import { ordering, groups } from "./constants/constants";
import { getLocalStorageItem } from "./helpers/localStorage";
import { setLocalStorageItem } from "./helpers/localStorage";
import { fetchKanbanData } from "./services/fetchKanbanData";

function groupTicketsByProperty(property, state) {
    const groupedTickets = {};

    state.forEach((ticket) => {
        const value = ticket[property];
        if (!groupedTickets[value]) {
            groupedTickets[value] = [];
        }
        groupedTickets[value].push(ticket);
    });

    return groupedTickets;
}

function App() {
    const [tickets, setTickets] = useState();
    const [users, setUsers] = useState();
    const [selectedGrouping, setSelectedGrouping] = useState(() => {
        const storedState = getLocalStorageItem("selectedgrouping");
        return storedState ? storedState : groups.STATUS;
    });
    const [selectedOrdering, setSelectedOrdering] = useState(() => {
        const storedState = getLocalStorageItem("selectedordering");
        return storedState ? storedState : ordering.PRIORITY;
    });
    const [displayState, setDisplayState] = useState(() => {
        const storedState = getLocalStorageItem("currentstate");
        return storedState ? storedState : [];
    });
    const [showFilterContainer, setShowFilterContainer] = useState(false);
    function getNameById(id) {
        const foundUser = users.find((u) => u.id === id);
        return foundUser ? foundUser.name : "User not found";
    }

    useEffect(() => {
        const loadKanbanData = async () => {
            try {
                const results = await fetchKanbanData();
                setTickets(results.tickets);
                setUsers(results.users);
            } catch (error) {
                console.error("Error loading kanban data:", error);
            }
        };
        loadKanbanData();
    }, []);

    useEffect(() => {
        if (tickets === undefined) return;
        if (displayState.length === 0) {
            const ticketsGroupedByStatus = groupTicketsByProperty(
                "status",
                tickets
            );
            setDisplayState(ticketsGroupedByStatus);
            setLocalStorageItem("currentstate", ticketsGroupedByStatus);
        }
    }, [tickets,displayState.length]);

    const groupHandler = (elmnt) => {
        setShowFilterContainer(false);
        setSelectedGrouping(elmnt.target.value);
        setLocalStorageItem("selectedgrouping", elmnt.target.value);
        if (elmnt.target.value === "user") {
            const ticketsGroupedByName = groupTicketsByProperty(
                "userId",
                tickets
            );
            Object.keys(ticketsGroupedByName).forEach(function (key) {
                var newkey = getNameById(key);
                ticketsGroupedByName[newkey] = ticketsGroupedByName[key];
                delete ticketsGroupedByName[key];
            });

            setDisplayState(ticketsGroupedByName);
            setLocalStorageItem("currentstate", ticketsGroupedByName);
        } else if (elmnt.target.value === "status") {
            const ticketsGroupedByStatus = groupTicketsByProperty(
                "status",
                tickets
            );
            setDisplayState(ticketsGroupedByStatus);
            setLocalStorageItem("currentstate", ticketsGroupedByStatus);
        } else if (elmnt.target.value === "priority") {
            const ticketsGroupedByPriority = groupTicketsByProperty(
                "priority",
                tickets
            );

            Object.keys(ticketsGroupedByPriority).forEach(function (ky) {
                var newkey = priorityMap[ky];
                ticketsGroupedByPriority[newkey] =
                    ticketsGroupedByPriority[ky];
                delete ticketsGroupedByPriority[ky];
            });
            setDisplayState(ticketsGroupedByPriority);
            setLocalStorageItem("currentstate", ticketsGroupedByPriority);
        }
    };
    const orderHandler = (elmnt) => {
        setShowFilterContainer(false);
        setSelectedOrdering(elmnt.target.value);
        setLocalStorageItem("selectedordering", elmnt.target.value);
        if (elmnt.target.value === "priority") {
            const sortTasksByPriority = (tasks) => {
                return tasks.slice().sort((a, b) => b.priority - a.priority);
            };

            const sortedData = {};

            for (const userName in displayState) {
                const userTasks = displayState[userName];
                const sortedTasks = sortTasksByPriority(userTasks);
                sortedData[userName] = sortedTasks;
            }

            setDisplayState(sortedData);
            setLocalStorageItem("currentstate", sortedData);
        } else if (elmnt.target.value === "title") {
            const sortTasksByTitleAscending = (tasks) => {
                return tasks
                    .slice()
                    .sort((a, b) => a.title.localeCompare(b.title));
            };

            const sortedData = {};

            for (const userName in displayState) {
                const userTasks = displayState[userName];
                const sortedTasks = sortTasksByTitleAscending(userTasks);
                sortedData[userName] = sortedTasks;
            }
            setDisplayState(sortedData);
            setLocalStorageItem("currentstate", sortedData);
        }
    };

    return (
        <article>
            <header>
                <div className="select-container">
                    <div
                        className="display-button border-curve pointer"
                        onClick={() => {
                            setShowFilterContainer((prev) => !prev);
                        }}
                    >
                        <AiOutlineMenu />
                        <p>Display</p>
                    </div>
                    {showFilterContainer ? (
                        <div className="select-popup border-curve">
                            <div className="flex-container">
                                <p>Grouping</p>
                                <select
                                    className="select-element"
                                    name="group-select"
                                    onChange={(elmnt) => groupHandler(elmnt)}
                                    value={selectedGrouping}
                                >
                                    {GroupingList.map((item) => (
                                        <option
                                            value={item}
                                            label={item}
                                            key={item}
                                        />
                                    ))}
                                </select>
                            </div>

                            <div className="flex-container">
                                <p>Ordering</p>
                                <select
                                    className="select-element"
                                    name="order-select"
                                    onChange={(elmnt) => orderHandler(elmnt)}
                                    value={selectedOrdering}
                                >
                                    {OrderingList.map((item) => (
                                        <option
                                            value={item}
                                            label={item}
                                            key={item}
                                        />
                                    ))}
                                </select>
                            </div>
                        </div>
                    ) : null}
                </div>
            </header>
            <main className="main-container">
                <div className="board-grid-container">
                    <div className="board-grid-inner">
                        {Object.keys(displayState).map((valu) => {
                            return (
                                <Board
                                    header={valu}
                                    tickets={displayState[valu]}
                                    key={valu}
                                />
                            );
                        })}
                    </div>
                </div>
            </main>
        </article>
    );
}

export default App;
