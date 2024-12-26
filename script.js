const stateInfo = document.getElementById('state-info');

datawrapper.on('region.mouseenter', ({ chartId, data }) => {
    if (!data || !data.Details) {
        stateInfo.innerHTML = `
            <h3 class="state-header">${data.State || 'Unknown State'}</h3>
            <p class="no-data">No preceptors or slots available in this state.</p>
        `;
        return;
    }

    try {
        // Fix JSON parsing for special characters
        let cleanDetails = data.Details
            .replace(/\\/g, '')  // Remove escape characters
            .replace(/"\s+/g, '"')  // Remove spaces after quotes
            .replace(/'\s+/g, "'")  // Remove spaces after single quotes
            .replace(/St\. Mary's/g, "St Marys")  // Handle St. Mary's special case
            .replace(/Women's Health/g, "Womens Health")  // Handle Women's Health
            .replace(/Children's/g, "Childrens")  // Handle Children's
            .replace(/Nile Women's/g, "Nile Womens")  // Handle Nile Women's
            .replace(/Boston Children's/g, "Boston Childrens")  // Handle Boston Children's
            .replace(/'/g, '"');  // Replace remaining single quotes with double quotes

        const details = JSON.parse(cleanDetails);

        let detailsHTML = `
            <h3 class="state-header">${data.State}</h3>
            <p><strong>Total Preceptors:</strong> ${data['Preceptor Count']}</p>
            <p><strong>Total Slots:</strong> ${data['Slot Count']}</p>
            <div class="preceptor-list">
        `;

        details.forEach(site => {
            // Restore special characters for display
            const siteName = site['Site Name']
                .replace(/St Marys/g, "St. Mary's")
                .replace(/Boston Childrens/g, "Boston Children's")
                .replace(/Nile Womens/g, "Nile Women's");

            const scpeType = site['SCPE Type']
                .replace(/Womens Health/g, "Women's Health")
                .replace(/Childrens/g, "Children's");

            detailsHTML += `
                <div class="site-info">
                    <strong>Preceptor:</strong> ${site['Preceptor Name']}<br>
                    <strong>Site:</strong> ${siteName}<br>
                    <strong>Address:</strong> ${site['Site Address']}<br>
                    <strong>Slots:</strong> ${site['Slot Count']}<br>
                    <strong>Type:</strong> ${scpeType}
                </div>
            `;
        });

        detailsHTML += '</div>';
        stateInfo.innerHTML = detailsHTML;
    } catch (e) {
        console.error('Error parsing details:', e);
        stateInfo.innerHTML = `
            <h3 class="state-header">${data.State}</h3>
            <p class="error">Error displaying state details. Please try again.</p>
        `;
    }
});
