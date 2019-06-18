export default {
    methods: {
        timeDifference(previous) {
            let current = new Date();
            let tgl = new Date(previous);
    
            let msPerMinute = 60 * 1000;
            let msPerHour = msPerMinute * 60;
            let msPerDay = msPerHour * 24;
            let msPerMonth = msPerDay * 30;
            let msPerYear = msPerDay * 365;
    
            let elapsed = current - tgl;
    
              if (elapsed < msPerMinute) {
                  return Math.round(elapsed/1000) + ' detik yang lalu';   
              } else if (elapsed < msPerHour) {
                  return Math.round(elapsed/msPerMinute) + ' menit yang lalu';   
              } else if (elapsed < msPerDay ) {
                  return Math.round(elapsed/msPerHour ) + ' jam yang lalu';   
              } else if (elapsed < msPerMonth) {
                  return Math.round(elapsed/msPerDay) + ' hari yang lalu';   
              } else if (elapsed < msPerYear) {
                  return Math.round(elapsed/msPerMonth) + ' bulan yang lalu';   
              } else {
                  return Math.round(elapsed/msPerYear ) + ' tahun yang lalu';   
              }
          },
          formatTgl(tgl) {
            let arrHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
            let arrBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      
            let date = new Date(tgl);
            let tanggal = date.getDate();
            let hari = date.getDay();
            let bulan = date.getMonth();
            let tahun = date.getFullYear();
      
            arrHari = arrHari[hari];
            arrBulan = arrBulan[bulan];
      
            //let tahun = (year < 1000) ? year + 1900 : year;
      
            let hasil = arrHari + ', ' + tanggal + ' ' + arrBulan + ' ' + tahun;
            
            return hasil;
          },
          formatTglFull(tgl) {
            let arrHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
            let arrBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      
            let date = new Date(tgl);
            let tanggal = date.getDate();
            let hari = date.getDay();
            let bulan = date.getMonth();
            let tahun = date.getFullYear();
            let jam = date.getHours();
            let menit = ('0' + date.getMinutes()).slice(-2);
            let detik = ('0' + date.getSeconds()).slice(-2);
      
            arrHari = arrHari[hari];
            arrBulan = arrBulan[bulan];
      
            //let tahun = (year < 1000) ? year + 1900 : year;
      
            let hasil = arrHari + ', ' + tanggal + ' ' + arrBulan + ' ' + tahun + ' ' + jam + ':' + menit + ':' + detik;
            
            return hasil;
          }
    }
}