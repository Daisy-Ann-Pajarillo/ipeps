const provincesCitiesWithMunicipalities = [
    {
        province: "Abra", 
        municipalities :[
            "Bangued", "Boliney", "Bucay", "Bucloc", "Daguioman", "Danglas", "Dolores", "La Paz", "Lacub", "Lagangilang", "Lagayan", "Langiden", "Licuan-Baay", "Luba", "Malibcong", "Manabo", "Peñarrubia", "Pidigan", "Pilar", "Sallapadan", "San Isidro", "San Juan", "San Quintin", "Tayum", "Tineg", "Tubo"
        ]
    },
    {
        province: "Agusan del Norte", 
        municipalities :[
            "Buenavista", "Butuan", "Cabadbaran", "Carmen", "Jabonga", "Kitcharao", "Las Nieves", "Magallanes", "Nasipit", "RTR (Remedios T. Romualdez)", "Santiago", "Tubay"
        ]
    },
    {
        province: "Agusan del Sur", 
        municipalities :[
            "Bayugan", "Bunawan", "Esperanza", "La Paz", "Loreto", "Prosperidad", "Rosario", "San Francisco", "San Luis", "Santa Josefa", "Sibagat", "Talacogon", "Trento", "Veruela"
        ]
    },
    {
        province: "Aklan", 
        municipalities :[
            "Altavas", "Balete", "Banga", "Batan", "Buruanga", "Ibajay", "Kalibo", "Lezo", "Libacao", "Madalag", "Makato", "Malay", "Malinao", "Nabas", "New Washington", "Numancia", "Tangalan"
        ]
    },
    {
        province: "Albay", 
        municipalities :[
            "Bacacay", "Camalig", "Daraga", "Guinobatan", "Jovellar", "Legazpi", "Libon", "Ligao", "Malilipot", "Malinao", "Manito", "Oas", "Pio Duran", "Polangui", "Rapu-Rapu", "Santo Domingo", "Tabaco", "Tiwi"
        ]
    },
    {
        province: "Antique", 
        municipalities :[
            "Anini-y", "Barbaza", "Belison", "Bugasong", "Caluya", "Culasi", "Hamtic", "Laua-an", "Libertad", "Pandan", "Patnongon", "San Jose de Buenavista", "San Remigio", "Sebaste", "Sibalom", "Tibiao", "Valderrama"
        ]
    },
    {
        province: "Apayao", 
        municipalities :[
            "Calanasan", "Conner", "Flora", "Kabugao", "Luna", "Pudtol", "Santa Marcela"
        ]
    },
    {
        province: "Aurora", 
        municipalities :[
            "Baler", "Casiguran", "Dilasag", "Dinalungan", "Dingalan", "Dipaculao", "Maria Aurora", "San Luis"
        ]
    },
    {
        province: "Basilan", 
        municipalities :[
            "Akbar", "Al-Barka", "Hadji Mohammad Ajul", "Hadji Muhtamad", "Isabela", "Lamitan", "Lantawan", "Maluso", "Sumisip", "Tabuan-Lasa", "Tipo-Tipo", "Tuburan", "Ungkaya Pukan"
        ]
    },
    {
        province: "Bataan", 
        municipalities :[
            "Abucay", "Bagac", "Balanga", "Dinalupihan", "Hermosa", "Limay", "Mariveles", "Morong", "Orani", "Orion", "Pilar", "Samal"
        ]
    },
    {
        province: "Batanes", 
        municipalities :[
            "Basco", "Itbayat", "Ivana", "Mahatao", "Sabtang", "Uyugan"
        ]
    },
    {
        province: "Batangas", 
        municipalities :[
            "Agoncillo", "Alitagtag", "Balayan", "Balete", "Batangas City", "Bauan", "Calaca", "Calatagan", "Cuenca", "Fernando Air Base", "Ibaan", "Laurel", "Lemery", "Lian", "Lipa", "Lobo", "Mabini", "Malvar", "Mataas na Kahoy", "Nasugbu", "Padre Garcia", "Rosario", "San Jose", "San Juan", "San Luis", "San Nicolas", "San Pascual", "Santa Teresita", "Santo Tomas", "Taal", "Talisay", "Tanauan", "Taysan", "Tingloy", "Tuy"
        ]
    },
    {
        province: "Benguet", 
        municipalities :[
            "Atok", "Bakun", "Bokod", "Buguias", "Itogon", "Kabayan", "Kapangan", "Kibungan", "La Trinidad", "Mankayan", "Sablan", "Tuba", "Tublay"
        ]
    },
    {
        province: "Biliran", 
        municipalities :[
            "Almeria", "Biliran", "Cabucgayan", "Caibiran", "Culaba", "Kawayan", "Maripipi", "Naval"
        ]
    },
    {
        province: "Bohol", 
        municipalities :[
            "Alburquerque", "Alicia", "Anda", "Antequera", "Baclayon", "Balilihan", "Batuan", "Bien Unido", "Bilar", "Buenavista", "Calape", "Candijay", "Carmen", "Catigbian", "Clarin", "Corella", "Cortes", "Dagohoy", "Danao", "Dauis", "Dimiao", "Duero", "Garcia Hernandez", "Getafe", "Guindulman", "Inabanga", "Jagna", "Jetafe", "Lila", "Loay", "Loboc", "Loon", "Mabini", "Maribojoc", "Panglao", "Pilar", "Pres. Carlos P. Garcia", "Sagbayan", "San Isidro", "San Miguel", "Sevilla", "Sierra Bullones", "Sikatuna", "Tagbilaran", "Talibon", "Trinidad", "Tubigon", "Ubay", "Valencia"
        ]
    },
    {
        province: "Bukidnon", 
        municipalities :[
            "Baungon", "Cabanglasan", "Damulog", "Dangcagan", "Don Carlos", "Impasug-ong", "Kadingilan", "Kalilangan", "Kibawe", "Kitaotao", "Lantapan", "Libona", "Malaybalay", "Malitbog", "Manolo Fortich", "Maramag", "Pangantucan", "Quezon", "San Fernando", "Sumilao", "Talakag", "Valencia"
        ]
    },
    {
        province: "Bulacan", 
        municipalities :[
            "Angat", "Balagtas", "Baliuag", "Bocaue", "Bulakan", "Bustos", "Calumpit", "Doña Remedios Trinidad", "Guiguinto", "Hagonoy", "Malolos", "Marilao", "Meycauayan", "Norzagaray", "Obando", "Pandi", "Paombong", "Plaridel", "Pulilan", "San Ildefonso", "San Jose del Monte", "San Miguel", "San Rafael", "Santa Maria"
        ]
    },
    {
        province: "Cagayan", 
        municipalities :[
            "Abulug", "Alcala", "Allacapan", "Amulung", "Aparri", "Baggao", "Ballesteros", "Buguey", "Calayan", "Camalaniugan", "Claveria", "Enrile", "Gattaran", "Gonzaga", "Iguig", "Lal-lo", "Lasam", "Pamplona", "Penablanca", "Piat", "Rizal", "Sanchez-Mira", "Santa Ana", "Santa Praxedes", "Santa Teresita", "Santo Niño", "Solana", "Tuao", "Tuguegarao"
        ]
    },
    {
        province: "Camarines Norte", 
        municipalities :[
            "Basud", "Capalonga", "Daet", "Jose Panganiban", "Labo", "Mercedes", "Paracale", "San Lorenzo Ruiz", "San Vicente", "Santa Elena", "Talisay", "Vinzons"
        ]
    },
    {
        province: "Camarines Sur", 
        municipalities :[
            "Baao", "Balatan", "Bato", "Bombon", "Buhi", "Bula", "Cabusao", "Calabanga", "Camaligan", "Canaman", "Caramoan", "Del Gallego", "Gainza", "Garchitorena", "Goa", "Iriga", "Lagonoy", "Libmanan", "Lupi", "Magarao", "Milaor", "Minalabac", "Nabua", "Naga", "Ocampo", "Pamplona", "Pasacao", "Pili", "Presentacion", "Ragay", "Sagñay", "San Fernando", "San Jose", "Sipocot", "Siruma", "Tigaon", "Tinambac"
        ]
    },
    {
        province: "Camiguin", 
        municipalities :[
            "Catarman", "Guinsiliban", "Mahinog", "Mambajao", "Sagay"
        ]
    },
    {
        province: "Capiz", 
        municipalities :[
            "Cuartero", "Dao", "Dumalag", "Dumarao", "Estancia", "Ivisan", "Jamindan", "Ma-ayon", "Mambusao", "Panay", "Panitan", "Pilar", "Pontevedra", "President Roxas", "Roxas", "Sapi-an", "Sigma"
        ]
    },
    {
        province: "Catanduanes", 
        municipalities :[
            "Bagamanoc", "Baras", "Bato", "Caramoran", "Gigmoto", "Pandan", "Panganiban", "San Andres", "San Miguel", "Viga", "Virac"
        ]
    },
    {
        province: "Cavite", 
        municipalities :[
            "Alfonso", "Amadeo", "Bacoor", "Carmona", "Cavite City", "Dasmariñas", "General Emilio Aguinaldo", "General Mariano Alvarez", "General Trias", "Imus", "Indang", "Kawit", "Magallanes", "Maragondon", "Mendez", "Naic", "Noveleta", "Rosario", "Silang", "Tagaytay", "Tanza", "Ternate", "Trece Martires"
        ]
    },
    {
        province: "Cebu", 
        municipalities :[
            "Alcantara", "Alcoy", "Alegria", "Aloguinsan", "Argao", "Asturias", "Badian", "Balamban", "Bantayan", "Barili", "Bogo", "Boljoon", "Borbon", "Carcar", "Carmen", "Catmon", "Cebu City", "Compostela", "Consolacion", "Cordova", "Daanbantayan", "Dalaguete", "Danao", "Dumanjug", "Ginatilan", "Lapu-Lapu", "Liloan", "Madridejos", "Malabuyoc", "Mandaue", "Medellin", "Minglanilla", "Moalboal", "Naga", "Oslob", "Pilar", "Pinamungajan", "Poro", "Ronda", "Samboan", "San Fernando", "San Francisco", "San Remigio", "Santa Fe", "Santander", "Sibonga", "Sogod", "Tabogon", "Tabuelan", "Talisay", "Toledo", "Tuburan", "Tudela"
        ]
    },
    {
        province: "Compostela Valley", 
        municipalities :[
            "Compostela", "Laak", "Mabini", "Maco", "Maragusan", "Mawab", "Monkayo", "Montevista", "Nabunturan", "New Bataan", "Pantukan"
        ]
    },
    {
        province: "Cotabato", 
        municipalities :[
            "Aleosan", "Antipas", "Arakan", "Banisilan", "Carmen", "Kabacan", "Kidapawan", "Libungan", "Magpet", "Makilala", "Matalam", "Midsayap", "Mlang", "Pigcawayan", "Pikit", "President Roxas", "Tulunan"
        ]
    },
    {
        province: "Davao de Oro", 
        municipalities :[
            "Compostela", "Laak", "Mabini", "Maco", "Maragusan", "Mawab", "Monkayo", "Montevista", "Nabunturan", "New Bataan", "Pantukan"
        ]
    },
    {
        province: "Davao del Norte", 
        municipalities :[
            "Asuncion", "Braulio E. Dujali", "Carmen", "Kapalong", "New Corella", "Panabo", "Samal", "Santo Tomas", "Tagum", "Talaingod", "Tublay"
        ]
    },
    {
        province: "Davao del Sur", 
        municipalities :[
            "Bansalan", "Davao City", "Digos", "Hagonoy", "Kiblawan", "Magsaysay", "Malalag", "Matanao", "Padada", "Santa Cruz", "Sulop", "Tupi"
        ]
    },
    {
        province: "Davao Occidental", 
        municipalities :[
            "Don Marcelino", "Jose Abad Santos", "Malita", "Santa Maria", "Sarangani"
        ]
    },
    {
        province: "Davao Oriental", 
        municipalities :[
            "Baganga", "Banaybanay", "Boston", "Caraga", "Cateel", "Governor Generoso", "Lupon", "Manay", "Mati", "San Isidro", "Tarragona"
        ]
    },
    {
        province: "Dinagat Islands", 
        municipalities :[
            "Basilisa", "Cagdianao", "Dinagat", "Libjo", "Loreto", "San Jose", "Tubajon"
        ]
    },
    {
        province: "Eastern Samar", 
        municipalities :[
            "Arteche", "Balangiga", "Balangkayan", "Borongan", "Can-avid", "Dolores", "General MacArthur", "Giporlos", "Guiuan", "Hernani", "Jipapad", "Lawaan", "Llorente", "Maslog", "Maydolong", "Mercedes", "Oras", "Quinapondan", "Salcedo", "San Julian", "San Policarpo", "Sulat", "Taft"
        ]
    },
    {
        province: "Guimaras", 
        municipalities :[
            "Buenavista", "Jordan", "Nueva Valencia", "San Lorenzo", "Sibunag"
        ]
    },
    {
        province: "Ifugao", 
        municipalities :[
            "Aguinaldo", "Alfonso Lista", "Asipulo", "Banaue", "Hingyon", "Hungduan", "Kiangan", "Lagawe", "Lamut", "Mayoyao", "Tinoc"
        ]
    },
    {
        province: "Ilocos Norte", 
        municipalities :[
            "Adams", "Bacarra", "Badoc", "Bangui", "Banna", "Batac", "Burgos", "Carasi", "Currimao", "Dingras", "Dumalneg", "Laoag", "Marcos", "Nueva Era", "Pagudpud", "Paoay", "Pasuquin", "Piddig", "Pinili", "San Nicolas", "Sarrat", "Solsona", "Vintar"
        ]
    },
    {
        province: "Ilocos Sur", 
        municipalities :[
            "Alilem", "Banayoyo", "Bantay", "Burgos", "Cabugao", "Candon", "Caoayan", "Cervantes", "Galimuyod", "Gregorio L. Cristobal", "Lidlidda", "Magsingal", "Nagbukel", "Narvacan", "Quirino", "Salcedo", "San Emilio", "San Esteban", "San Ildefonso", "San Juan", "San Vicente", "Santa", "Santa Catalina", "Santa Cruz", "Santa Lucia", "Santa Maria", "Santiago", "Santo Domingo", "Sigay", "Sinait", "Sugpon", "Suyo", "Tagudin", "Vigan"
        ]
    },
    {
        province: "Iloilo", 
        municipalities :[
            "Ajuy", "Alimodian", "Anilao", "Badiangan", "Balasan", "Banate", "Barotac Nuevo", "Barotac Viejo", "Batad", "Bingawan", "Cabatuan", "Calinog", "Carles", "Concepcion", "Dingle", "Dueñas", "Dumangas", "Estancia", "Guimbal", "Igbaras", "Iloilo City", "Janiuay", "Lambunao", "Leganes", "Lemery", "Leon", "Maasin", "Miagao", "Mina", "New Lucena", "Oton", "Passi", "Pavia", "Pototan", "San Dionisio", "San Enrique", "San Joaquin", "San Miguel", "Sevilla", "Zarraga"
        ]
    },
    {
        province: "Isabela", 
        municipalities :[
            "Alicia", "Angadanan", "Aurora", "Burgos", "Cabagan", "Cabatuan", "Cauayan", "Cordon", "Delfin Albano", "Dinapigue", "Divilacan", "Echague", "Gamu", "Ilagan", "Jones", "Luna", "Maconacon", "Mallig", "Naguilian", "Palanan", "Quezon", "Quirino", "Ramon", "Reina Mercedes", "Roxas", "San Agustin", "San Guillermo", "San Isidro", "San Manuel", "San Mariano", "San Mateo", "San Pablo", "Santa Maria", "Santiago", "Santo Tomas", "Tumauini"
        ]
    },
    {
        province: "Kalinga", 
        municipalities :[
            "Balbalan", "Lubuagan", "Pasil", "Pinukpuk", "Rizal", "Tabuk", "Tanudan", "Tinglayan"
        ]
    },
    {
        province: "La Union", 
        municipalities :[
            "Agoo", "Aringay", "Bacnotan", "Bagulin", "Balaoan", "Bangar", "Bauang", "Burgos", "Caba", "Luna", "Naguilian", "Pugo", "Rosario", "San Fernando", "San Gabriel", "San Juan", "Santo Tomas", "Santol", "Sudipen", "Tubao"
        ]
    },
    {
        province: "Laguna", 
        municipalities :[
            "Alaminos", "Bay", "Biñan", "Cabuyao", "Calamba", "Calauan", "Cavinti", "Famy", "Kalayaan", "Liliw", "Los Baños", "Luisiana", "Lumban", "Mabitac", "Magdalena", "Majayjay", "Nagcarlan", "Paete", "Pagsanjan", "Pakil", "Pangil", "Pila", "Rizal", "San Pablo", "San Pedro", "Santa Cruz", "Santa Maria", "Santa Rosa", "Siniloan", "Victoria"
        ]
    },
    {
        province: "Lanao del Norte", 
        municipalities :[
            "Bacolod", "Baloi", "Baroy", "Iligan", "Kapatagan", "Kauswagan", "Kolambugan", "Lala", "Linamon", "Magsaysay", "Maigo", "Matungao", "Munai", "Nunungan", "Pantao Ragat", "Pantar", "Poona Piagapo", "Salvador", "Sapad", "Sultan Naga Dimaporo", "Tagoloan", "Tangcal", "Tubod"
        ]
    },
    {
        province: "Lanao del Sur", 
        municipalities :[
            "Bacolod-Kalawi", "Balabagan", "Balindong", "Bayang", "Binidayan", "Buadiposo-Buntong", "Bumbaran", "Butig", "Calanogas", "Ditsaan-Ramain", "Ganassi", "Kapai", "Lumba-Bayabao", "Lumbaca-Unayan", "Lumbatan", "Lumbayanague", "Madalum", "Madamba", "Maguing", "Malabang", "Marantao", "Marogong", "Masiu", "Mulondo", "Pagayawan", "Piagapo", "Picong", "Poona Bayabao", "Pualas", "Saguiaran", "Sultan Dumalondong", "Sultan Gumander", "Sultan Mastura", "Sultan sa Barongis", "Sultan Sumagka", "Tamparan", "Taraka", "Tubaran", "Tugaya", "Wao"
        ]
    },
    {
        province: "Leyte", 
        municipalities :[
            "Abuyog", "Alangalang", "Albuera", "Babatngon", "Barugo", "Bato", "Baybay", "Burauen", "Calubian", "Capoocan", "Carigara", "Dagami", "Dulag", "Hilongos", "Hindang", "Inopacan", "Isabel", "Jaro", "Julita", "Kananga", "La Paz", "Leyte", "MacArthur", "Mahaplag", "Matag-ob", "Matalom", "Mayorga", "Merida", "Ormoc", "Palo", "Palompon", "Pastrana", "San Isidro", "San Miguel", "Santa Fe", "Tabango", "Tabontabon", "Tacloban", "Tanauan", "Tolosa", "Tunga", "Villaba"
        ]
    },
    {
        province: "Maguindanao", 
        municipalities :[
            "Ampatuan", "Barira", "Buldon", "Buluan", "Datu Abdullah Sangki", "Datu Anggal Midtimbang", "Datu Blah T. Sinsuat", "Datu Hoffer Ampatuan", "Datu Montawal", "Datu Odin Sinsuat", "Datu Paglas", "Datu Piang", "Datu Salibo", "Datu Saudi-Ampatuan", "Datu Unsay", "General Salipada K. Pendatun", "Guindulungan", "Kabuntalan", "Mamasapano", "Mangudadatu", "Matungao", "Northern Kabuntalan", "Pagagawan", "Paglat", "Pandag", "Parang", "Rajah Buayan", "Shariff Aguak", "South Upi", "Sultan Kudarat", "Sultan Mastura", "Sultan sa Barongis", "Sultan Sumagka", "Tamparan", "Taraka", "Tubaran", "Tugaya", "Wao"
        ]
    },
    {
        province: "Marinduque", 
        municipalities :[
            "Boac", "Buenavista", "Gasan", "Mogpog", "Santa Cruz", "Torrijos"
        ]
    },
    {
        province: "Masbate", 
        municipalities :[
            "Aroroy", "Baleno", "Balud", "Batuan", "Cataingan", "Cawayan", "Claveria", "Dimasalang", "Esperanza", "Mandaon", "Masbate City", "Milagros", "Mobo", "Monreal", "Palanas", "Pio V. Corpus", "Placer", "San Fernando", "San Jacinto", "San Pascual", "Uson"
        ]
    },
    {
        province: "Misamis Occidental", 
        municipalities :[
            "Aloran", "Baliangao", "Bonifacio", "Calamba", "Clarin", "Concepcion", "Don Victoriano Chiongbian", "Jimenez", "Lopez Jaena", "Oroquieta", "Ozamiz", "Panaon", "Plaridel", "Sapang Dalaga", "Sinacaban", "Tangub", "Tudela"
        ]
    },
    {
        province: "Misamis Oriental", 
        municipalities :[
            "Alubijid", "Balingasag", "Balingoan", "Binuangan", "Cagayan de Oro", "Claveria", "El Salvador", "Gitagum", "Initao", "Jasaan", "Kinoguitan", "Lagonglong", "Laguindingan", "Libertad", "Lugait", "Magsaysay", "Manticao", "Medina", "Naawan", "Opol", "Salay", "Sugbongcogon", "Talisayan", "Villanueva"
        ]
    },
    {
        province: "Mountain Province", 
        municipalities :[
            "Bakun", "Bontoc", "Kibungan", "Paracelis", "Sabangan", "Sadanga", "Sagada", "Tadian"
        ]
    },
    {
        province: "Negros Occidental", 
        municipalities :[
            "Bacolod", "Bago", "Binalbagan", "Cadiz", "Calatrava", "Candoni", "Cauayan", "Enrique B. Magalona", "Escalante", "Himamaylan", "Hinigaran", "Hinoba-an", "Ilog", "Isabela", "Kabankalan", "La Carlota", "La Castellana", "Manapla", "Moises Padilla", "Murcia", "Pontevedra", "Pulupandan", "Sagay", "Salvador Benedicto", "San Carlos", "San Enrique", "Silay", "Sipalay", "Talisay", "Toboso", "Valladolid", "Victorias"
        ]
    },
    {
        province: "Negros Oriental", 
        municipalities :[
            "Amlan", "Ayungon", "Bacong", "Bais", "Basay", "Bayawan", "Bindoy", "Canlaon", "Dauin", "Dumaguete", "Guihulngan", "Jimalalud", "La Libertad", "Mabinay", "Manjuyod", "Pamplona", "San Jose", "Santa Catalina", "Siaton", "Sibulan", "Tanjay", "Tayasan", "Valencia", "Vallehermoso", "Zamboanguita"
        ]
    },
    {
        province: "Northern Samar", 
        municipalities :[
            "Allen", "Biri", "Bobon", "Capul", "Catarman", "Catubig", "Gamay", "Laoang", "Lapinig", "Las Navas", "Lavezares", "Lope de Vega", "Mapanas", "Mondragon", "Palapag", "Pambujan", "Rosario", "San Antonio", "San Isidro", "San Jose", "San Roque", "San Vicente", "Silvino Lobos", "Victoria"
        ]
    },
    {
        province: "Nueva Ecija", 
        municipalities :[
            "Aliaga", "Bongabon", "Cabanatuan", "Cabiao", "Carranglan", "Cuyapo", "Gabaldon", "Gapan", "General Mamerto Natividad", "General Tinio", "Guimba", "Jaen", "Laur", "Licab", "Llanera", "Lupao", "Muñoz", "Nampicuan", "Palayan", "Pantabangan", "Peñaranda", "Quezon", "Rizal", "San Antonio", "San Isidro", "San Jose", "San Leonardo", "Santa Rosa", "Santo Domingo", "Talavera", "Talugtug", "Zaragoza"
        ]
    },
    {
        province: "Nueva Vizcaya", 
        municipalities :[
            "Ambaguio", "Aritao", "Bagabag", "Bambang", "Bayombong", "Diadi", "Dupax del Norte", "Dupax del Sur", "Kasibu", "Kayapa", "Quezon", "Santa Fe", "Solano", "Villaverde"
        ]
    },
    {
        province: "Occidental Mindoro", 
        municipalities :[
            "Abra de Ilog", "Calintaan", "Looc", "Lubang", "Magsaysay", "Mamburao", "Paluan", "Rizal", "Sablayan", "San Jose", "Santa Cruz"
        ]
    },
    {
        province: "Oriental Mindoro", 
        municipalities :[
            "Baco", "Bansud", "Bongabong", "Bulalacao", "Calapan", "Gloria", "Mansalay", "Naujan", "Pinamalayan", "Pola", "Puerto Galera", "Roxas", "San Teodoro", "Socorro", "Victoria"
        ]
    },
    {
        province: "Palawan", 
        municipalities :[
            "Aborlan", "Agutaya", "Araceli", "Balabac", "Bataraza", "Brooke's Point", "Busuanga", "Cagayancillo", "Coron", "Culion", "Cuyo", "Dumaran", "El Nido", "Kalayaan", "Linapacan", "Magsaysay", "Narra", "Puerto Princesa", "Quezon", "Rizal", "Roxas", "San Vicente", "Sofronio Española", "Taytay"
        ]
    },
    {
        province: "Pampanga", 
        municipalities :[
            "Angeles", "Apalit", "Arayat", "Bacolor", "Candaba", "Floridablanca", "Guagua", "Lubao", "Mabalacat", "Macabebe", "Magalang", "Masantol", "Mexico", "Minalin", "Porac", "San Fernando", "San Luis", "San Simon", "Santa Ana", "Santa Rita", "Santo Tomas", "Sasmuan"
        ]
    },
    {
        province: "Pangasinan", 
        municipalities :[
            "Agno", "Aguilar", "Alaminos", "Alcala", "Anda", "Asingan", "Balungao", "Bani", "Basista", "Bautista", "Bayambang", "Binalonan", "Binmaley", "Bolinao", "Bugallon", "Burgos", "Calasiao", "Dasol", "Infanta", "Labrador", "Laoac", "Lingayen", "Mabini", "Malasiqui", "Manaoag", "Mangaldan", "Mangatarem", "Mapandan", "Natividad", "Pozorrubio", "Rosales", "San Carlos", "San Fabian", "San Jacinto", "San Manuel", "San Nicolas", "San Quintin", "Santa Barbara", "Santa Maria", "Santo Tomas", "Sison", "Sual", "Tayug", "Umingan", "Urbiztondo", "Villasis"
        ]
    },
    {
        province: "Quezon", 
        municipalities :[
            "Agdangan", "Alabat", "Atimonan", "Buenavista", "Burdeos", "Calauag", "Candelaria", "Catanauan", "Dolores", "General Luna", "General Nakar", "Guinayangan", "Gumaca", "Infanta", "Jomalig", "Lopez", "Lucban", "Lucena", "Macalelon", "Mauban", "Mulanay", "Padre Burgos", "Pagbilao", "Panukulan", "Patnanungan", "Perez", "Pitogo", "Plaridel", "Polillo", "Quezon", "Real", "Sampaloc", "San Andres", "San Antonio", "San Francisco", "San Jose", "San Narciso", "Sariaya", "Tagkawayan", "Tayabas", "Tiaong", "Unisan"
        ]
    },
    {
        province: "Quirino", 
        municipalities :[
            "Aglipay", "Cabarroguis", "Diffun", "Maddela", "Nagtipunan", "Saguday"
        ]
    },
    {
        province: "Rizal", 
        municipalities :[
            "Angono", "Antipolo", "Baras", "Binangonan", "Cainta", "Cardona", "Jalajala", "Morong", "Pililla", "Rodriguez", "San Mateo", "Tanay", "Taytay"
        ]
    },
    {
        province: "Romblon", 
        municipalities :[
            "Alcantara", "Banton", "Cajidiocan", "Calatrava", "Concepcion", "Corcuera", "Ferrol", "Looc", "Magdiwang", "Odiongan", "Romblon", "San Agustin", "San Andres", "San Fernando", "San Jose", "Santa Fe", "Santa Maria"
        ]
    },
    {
        province: "Samar", 
        municipalities :[
            "Almagro", "Basey", "Calbayog", "Calbiga", "Catbalogan", "Daram", "Gandara", "Hinabangan", "Jiabong", "Marabut", "Matuguinao", "Motiong", "Pagsanghan", "Paranas", "Pinabacdao", "San Jorge", "San Jose de Buan", "San Sebastian", "Santa Margarita", "Santa Rita", "Santo Niño", "Tagapul-an", "Talalora", "Tarangnan", "Villareal", "Zumarraga"
        ]
    },
    {
        province: "Sarangani", 
        municipalities :[
            "Alabel", "Glan", "Kiamba", "Maasim", "Maitum", "Malapatan", "Malungon"
        ]
    },
    {
        province: "Siquijor", 
        municipalities :[
            "Enrique Villanueva", "Larena", "Lazi", "Maria", "San Juan", "Siquijor"
        ]
    },
    {
        province: "Sorsogon", 
        municipalities :[
            "Barcelona", "Bulan", "Bulusan", "Casiguran", "Castilla", "Donsol", "Gubat", "Irosin", "Juban", "Magallanes", "Matnog", "Pilar", "Prieto Diaz", "Santa Magdalena", "Sorsogon City"
        ]
    },
    {
        province: "South Cotabato", 
        municipalities :[
            "Banga", "General Santos", "Koronadal", "Lake Sebu", "Norala", "Polomolok", "Surallah", "T'boli", "Tampakan", "Tantangan", "Tupi"
        ]
    },
    {
        province: "Southern Leyte", 
        municipalities :[
            "Anahawan", "Bontoc", "Hinunangan", "Hinundayan", "Libagon", "Liloan", "Limasawa", "Maasin", "Macrohon", "Malitbog", "Padre Burgos", "Pintuyan", "Saint Bernard", "San Francisco", "San Juan", "San Ricardo", "Silago", "Sogod", "Tomas Oppus"
        ]
    },
    {
        province: "Sultan Kudarat", 
        municipalities :[
            "Bagumbayan", "Columbio", "Esperanza", "Isulan", "Kalamansig", "Lambayong", "Lebak", "Lutayan", "Palimbang", "President Quirino", "Senator Ninoy Aquino", "Tacurong"
        ]
    },
    {
        province: "Sulu", 
        municipalities :[
            "Banguingui", "Hadji Panglima Tahil", "Indanan", "Jolo", "Kalingalan Caluang", "Lugus", "Luuk", "Maimbung", "Old Panamao", "Omar", "Pandami", "Pangutaran", "Parang", "Pata", "Patikul", "Siasi", "Talipao", "Tapul"
        ]
    },
    {
        province: "Surigao del Norte", 
        municipalities :[
            "Alegria", "Bacuag", "Burgos", "Claver", "Dapa", "Del Carmen", "General Luna", "Gigaquit", "Mainit", "Malimono", "Pilar", "Placer", "San Benito", "San Francisco", "San Isidro", "Santa Monica", "Sison", "Socorro", "Sta. Ana", "Tagana-an", "Tubod"
        ]
    },
    {
        province: "Surigao del Sur", 
        municipalities :[
            "Barobo", "Bayabas", "Bislig", "Cagwait", "Cantilan", "Carmen", "Carrascal", "Cortes", "Hinatuan", "Lanuza", "Lianga", "Lingig", "Madrid", "Marihatag", "San Agustin", "San Miguel", "Tagbina", "Tago", "Tandag"
        ]
    },
    {
        province: "Tarlac", 
        municipalities :[
            "Anao", "Bamban", "Camiling", "Capas", "Concepcion", "Gerona", "La Paz", "Mayantoc", "Moncada", "Paniqui", "Pura", "Ramos", "San Clemente", "San Jose", "San Manuel", "San Miguel", "Santa Ignacia", "Tarlac City", "Victoria"
        ]
    },
    {
        province: "Tawi-Tawi", 
        municipalities :[
            "Bongao", "Languyan", "Mapun", "Panglima Sugala", "Sapa-Sapa", "Sibutu", "Simunul", "Sitangkai", "Tandubas", "Turtle Islands"
        ]
    },
    {
        province: "Zambales", 
        municipalities :[
            "Botolan", "Cabangan", "Candelaria", "Castillejos", "Iba", "Masinloc", "Olongapo", "Palauig", "San Antonio", "San Felipe", "San Marcelino", "San Narciso", "Santa Cruz", "Subic"
        ]
    },
    {
        province: "Zamboanga del Norte", 
        municipalities :[
            "Bacungan", "Baliguian", "Dapitan", "Dipolog", "Godod", "Gutalac", "Jose Dalman", "Kalawit", "Katipunan", "La Libertad", "Labason", "Leon B. Postigo", "Liloy", "Manukan", "Mutia", "Piñan", "Polanco", "President Manuel A. Roxas", "Rizal", "Salug", "Sergio Osmeña Sr.", "Siayan", "Sibuko", "Sindangan", "Siocon", "Sirawai", "Tampilisan"
        ]
    },
    {
        province: "Zamboanga del Sur", 
        municipalities :[
            "Aurora", "Bayog", "Dimataling", "Dinas", "Dumalinao", "Dumingag", "Guipos", "Josefina", "Kumalarang", "Labangan", "Lakewood", "Lapuyan", "Mahayag", "Margosatubig", "Midsalip", "Molave", "Pagadian", "Pitogo", "Ramón Magsaysay", "San Miguel", "San Pablo", "Sominot", "Tabina", "Tambulig", "Tigbao", "Tukuran", "Vincenzo A. Sagun", "Zamboanga City"
        ]
    },
    {
        province: "Zamboanga Sibugay", 
        municipalities :[
            "Alicia", "Buug", "Diplahan", "Imelda", "Ipil", "Kabasalan", "Mabuhay", "Malangas", "Naga", "Olutanga", "Payao", "Roseller Lim", "Siay", "Talusan", "Titay", "Tungawan"
        ]
    }
];


export default provincesCitiesWithMunicipalities;