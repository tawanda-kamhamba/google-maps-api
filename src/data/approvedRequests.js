const mockApprovedRequests = [
  {
    id: 101,
    title: "Laptop Purchase",
    requestedBy: "Alice Johnson",
    department: "IT",
    dateRequested: "2023-03-05",
    dateApproved: "2023-03-06",
    approvedBy: "David Miller",
    totalAmount: 1299.99,
    status: "approved",
    disbursed: false,
    items: [
      {
        description: "Dell XPS 13 Laptop",
        quantity: 1,
        estimatedCost: 1299.99,
      },
    ],
    justification: "Replacement for damaged equipment.",
  },
  {
    id: 102,
    title: "Conference Travel",
    requestedBy: "Bob Williams",
    department: "Marketing",
    dateRequested: "2023-03-04",
    dateApproved: "2023-03-05",
    approvedBy: "Sarah Thompson",
    totalAmount: 1850.0,
    status: "approved",
    disbursed: false,
    items: [
      { description: "Flight Tickets", quantity: 1, estimatedCost: 650.0 },
      { description: "Hotel (3 nights)", quantity: 1, estimatedCost: 900.0 },
      { description: "Per Diem", quantity: 3, estimatedCost: 100.0 },
    ],
    justification: "Annual marketing conference attendance.",
  },
];
export default mockApprovedRequests;
