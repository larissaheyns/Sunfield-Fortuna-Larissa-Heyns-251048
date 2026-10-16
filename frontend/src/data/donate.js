export const DONATE = {
  // IMPORTANT: leave this false until Sunfield has confirmed the banking details (e.g. against an FNB
  // confirmation letter or a bank statement). While false, the page says the details are coming soon
  // instead of showing them, so nobody can send money to a wrong account by mistake.
  verified: true,

  bank: {
    bank: "First National Bank (FNB)",
    accountName: "Sunfield Home Fortuna",
    branch: "Balfour",
    accountNumber: "51590025157",
    accountType: "Platinum Business Account",
  },

  fundsPurpose: "Financial support helps the home cover everyday costs such as utilities, food, medical expenses and running the home.",

  priorityItems: [
    { title: "Clothing & personal care", text: "Pyjamas (men and women), hair dryers and toiletries." },
    { title: "Groceries & kitchen supplies", text: "Staple tinned food, long-life food items and bulk ingredients for three meals a day." },
    { title: "Hygiene & medical", text: "Adult diapers, personal hygiene items and cleaning products." },
  ],

  contacts: [
    { name: "Brenda Mendes", role: "General Manager", phones: ["072 826 0556", "017 773 9014"] },
    // { name: "Brenda Gouws", role: "", phones: ["071 301 8300"] },
  ],
};
