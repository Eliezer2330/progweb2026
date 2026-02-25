$(document).ready(function(){

    /* ===============================
       AUTOCOMPLETE PAÍSES
    =============================== */

    let paises = [
        "México","Estados Unidos","Canadá","Argentina",
        "Colombia","Chile","Perú","España","Francia",
        "Italia","Alemania","Brasil","Japón","China"
    ];

    $("#pais").autocomplete({
        source: paises
    });

    /* ===============================
       SCORE → BURÓ AUTOMÁTICO
    =============================== */

    $("#score").on("input", function(){

        let score = parseInt($(this).val());
        $("#valorScore").text(score);

        let buro = "";
        let clase = "";

        if(score >= 700){
            buro = "Bueno";
            clase = "range-bueno";
        }
        else if(score >= 600){
            buro = "Regular";
            clase = "range-regular";
        }
        else{
            buro = "Malo";
            clase = "range-malo";
        }

        $("#buro").val(buro);

        // Cambiar color del slider
        $("#score").removeClass("range-bueno range-regular range-malo");
        $("#score").addClass(clase);
    });

    /* ===============================
       RANGE MESES
    =============================== */

    $("#meses").on("input", function(){
        $("#valorMeses").text($(this).val());
    });

});


function evaluarCredito(){

    let edad = parseInt($("#edad").val());
    let ingresos = parseFloat($("#ingresos").val());
    let buro = $("#buro").val();
    let score = parseInt($("#score").val());
    let monto = parseFloat($("#monto").val());
    let meses = parseInt($("#meses").val());

    // 🔵 Tasa base Banxico (puedes actualizarla cuando cambie)
    const tasaBanxico = 7.00;

    // Ajuste según score
    let tasaAnual;

    if (score >= 700) {
        tasaAnual = tasaBanxico + 1;
    } 
    else if (score >= 600) {
        tasaAnual = tasaBanxico + 3;
    } 
    else {
        tasaAnual = tasaBanxico + 5;
    }

    // 🔥 AQUÍ se coloca automáticamente en el input
    $("#tasaAnual").val(tasaAnual.toFixed(2));

    // Cálculo
    let tasaMensual = tasaAnual / 100 / 12;
    let pagoMensual = (monto * tasaMensual) /
        (1 - Math.pow(1 + tasaMensual, -meses));

    let resultado = $("#resultado");

    let aprobado = true;
    let motivo = "";

    if (edad < 18) {
        aprobado = false;
        motivo = "Debe ser mayor de edad.";
    }
    else if (buro === "Malo") {
        aprobado = false;
        motivo = "Historial crediticio negativo.";
    }
    else if (pagoMensual > (ingresos * 0.40)) {
        aprobado = false;
        motivo = "El pago mensual supera el 40% de sus ingresos.";
    }

    resultado.removeClass("d-none");

    if (aprobado) {
        resultado.removeClass("alert-danger")
                 .addClass("alert alert-success")
                 .html(`
                    <strong>Crédito Aprobado ✅</strong><br>
                    Pago mensual estimado: $${pagoMensual.toFixed(2)}
                 `);
    } else {
        resultado.removeClass("alert-success")
                 .addClass("alert alert-danger")
                 .html(`
                    <strong>Crédito Rechazado ❌</strong><br>
                    Motivo: ${motivo}
                 `);
    }
}