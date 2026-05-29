const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    adminOnly: true,
    data: new SlashCommandBuilder()
        .setName("rules")
        .setDescription("Create a formal rules channel with official server rules"),

    async execute(interaction) {

        // Create the rules channel
        const channel = await interaction.guild.channels.create({
            name: "rules",
            type: 0 // Text channel
        });

        // Full formal rules text
        const rulesText =
`📜 **SERVER RULES — OFFICIAL COMMUNITY GUIDELINES**
Welcome to the server. To maintain a safe, respectful, and enjoyable environment for all members, the following rules apply at all times. By participating in this community, you agree to follow these guidelines.

---

## **1. Respect & Conduct**
- Treat all members with courtesy and professionalism.
- Harassment, bullying, discrimination, hate speech, slurs, or personal attacks are strictly prohibited.
- Do not provoke, escalate, or encourage conflict.
- Respect cultural, national, and personal differences.

---

## **2. NSFW & Inappropriate Content**
- Absolutely **no NSFW**, sexual, graphic, violent, or disturbing content.
- This includes text, images, videos, emojis, GIFs, links, and usernames.
- Do not discuss explicit topics or sexual themes.

---

## **3. Spam, Flooding & Disruption**
- Do not spam messages, emojis, reactions, soundboard clips, or pings.
- Avoid excessive caps, repeated messages, or disruptive behaviour.
- Do not intentionally derail conversations or cause chaos.

---

## **4. Underage Safety Policy**
- Members must follow Discord’s age requirement (13+).
- Do **not** reveal your age if you are under 13.
- Do **not** joke about being underage.
- Any confirmed underage account will be removed for safety.

---

## **5. Channel Usage**
- Post content in the correct channels.
- Follow channel descriptions and pinned messages.
- Do not misuse support, report, or staff-only channels.

---

## **6. Nationality, Politics & Sensitive Topics**
- Light jokes are acceptable, but:
  - No excessive nationalism
  - No country hate
  - No political harassment
  - No attacking groups of people
- Keep discussions respectful and non-hostile.

---

## **7. Advertising & Self-Promotion**
- Advertising is **not allowed** outside the designated channel.
- No unsolicited DMs promoting servers, products, or social media.
- Staff may remove any promotional content at their discretion.

---

## **8. Privacy & Safety**
- Do not share personal information (yours or others’).
- No doxxing, threats, blackmail, or intimidation.
- No discussing illegal activities or harmful behaviour.

---

## **9. Impersonation & Identity**
- Do not impersonate staff, bots, or other members.
- Fake identities, misleading usernames, or deceptive behaviour are not allowed.

---

## **10. Raiding, Exploits & Malicious Activity**
- Raiding, griefing, exploiting, or attempting to harm the server is strictly forbidden.
- Any malicious activity results in an immediate ban.

---

## **11. Staff Authority**
- Staff decisions are final.
- Arguing with staff, ignoring instructions, or attempting to bypass punishments is not allowed.
- If you believe a decision was unfair, use the proper appeal process.

---

## **12. Discord Terms of Service**
All members must follow Discord’s official rules:
https://discord.com/terms
https://discord.com/guidelines

Violations of Discord TOS may result in immediate removal.

---

## **13. Enforcement**
Punishments may include:
- Verbal warnings
- Official warnings
- Timeouts
- Mutes
- Blacklisting
- Kicks
- Bans

Severity depends on the situation and staff judgment.

---

## **Thank You**
By following these rules, you help keep the community safe, respectful, and enjoyable for everyone.`;

        // Send rules
        await channel.send(rulesText);

        // Confirm to admin
        interaction.reply({
            content: "Formal rules channel created successfully.",
            ephemeral: true
        });
    }
};
