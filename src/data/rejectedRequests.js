const mockRejectedRequests = [
  {
    id: 105,
    title: "Premium Software",
    requestedBy: "Eve Martin",
    department: "Engineering",
    dateRequested: "2023-03-02",
    dateRejected: "2023-03-03",
    rejectedBy: "James Anderson",
    rejectionReason:
      "There is a free alternative available that meets our needs.",
    totalAmount: 2500.0,
    status: "rejected",
    items: [
      {
        description: "Premium Design Software",
        quantity: 5,
        estimatedCost: 500.0,
      },
    ],
    justification: "Needed for upcoming project.",
  },
];

export default mockRejectedRequests;
