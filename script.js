document.getElementById('utxo-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const address = document.getElementById('address').value;
    const utxoTableBody = document.getElementById('utxo-table-body');

    // 清空现有结果
    utxoTableBody.innerHTML = '';

    try {
        // 调用API获取UTXO数据
        const apiUrl = `https://api.kaspa.org/addresses/${encodeURIComponent(address)}/utxos`;
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'accept': 'application/json'
            }
        });

        // 检查响应状态
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data); // 调试输出

        // 检查data是否为数组
        if (!Array.isArray(data)) {
            throw new Error('UTXOs data is not an array.');
        }

        if (data.length === 0) {
            utxoTableBody.innerHTML = '<tr><td colspan="4">No UTXOs found for this address.</td></tr>';
        } else {
            data.forEach(utxo => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${utxo.outpoint.transactionId}</td>
                    <td>${utxo.outpoint.index}</td>
                    <td>${utxo.utxoEntry.amount}</td>
                    <td>${utxo.utxoEntry.blockDaaScore}</td>
                `;
                utxoTableBody.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Error fetching UTXOs:', error);
        utxoTableBody.innerHTML = `<tr><td colspan="4">Error fetching data: ${error.message}. Please try again later.</td></tr>`;
    }
});