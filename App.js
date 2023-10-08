import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import generateId from "react-id-generator";

const App = () => {
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [sueldo, setSueldo] = useState("");
  const [porcentajeRenta, setPorcentajeRenta] = useState(null);
  const [sueldoNeto, setSueldoNeto] = useState(null);
  const [cambioIn, setCambioin] = useState(false);
  const [resultadosGuardados, setResultadosGuardados] = useState([]);
  const [resultadoSeleccionadoId, setResultadoSeleccionadoId] = useState(null);

  useEffect(() => {
    cargarResultados();
  }, []);

  const cargarResultados = async () => {
    try {
      const listaResultados = await AsyncStorage.getItem("resultados");
      if (listaResultados !== null) {
        setResultadosGuardados(JSON.parse(listaResultados));
      }
    } catch (error) {
      console.error("Error al cargar resultados:", error);
    }
  };

  const guardarResultado = async () => {
    if (nombre && apellidos && sueldo && porcentajeRenta && sueldoNeto) {
      const id = generateId();
      const nuevoResultado = {
        id,
        nombre,
        apellidos,
        sueldo: parseFloat(sueldo),
        porcentajeRenta,
        sueldoNeto: parseFloat(sueldoNeto.split("$")[1]),
      };

      try {
        const listaResultadosActualizada = [
          ...resultadosGuardados,
          nuevoResultado,
        ];
        await AsyncStorage.setItem(
          "resultados",
          JSON.stringify(listaResultadosActualizada)
        );
        setResultadosGuardados(listaResultadosActualizada);
        setCambioin(false);
        alert("Resultado guardado con éxito.");
      } catch (error) {
        console.error("Error al guardar resultado:", error);
      }
    }
  };

  const eliminarResultado = async (id) => {
    try {
      const listaResultadosActualizada = resultadosGuardados.filter(
        (resultado) => resultado.id !== id
      );
      await AsyncStorage.setItem(
        "resultados",
        JSON.stringify(listaResultadosActualizada)
      );
      setResultadosGuardados(listaResultadosActualizada);
      alert("Resultado eliminado con éxito.");
    } catch (error) {
      console.error("Error al eliminar resultado:", error);
    }
  };

  const calcularRenta = () => {
    if (
      nombre.length > 0 &&
      apellidos.length > 0 &&
      sueldo.length > 0 &&
      cambioIn
    ) {
      const sueldoFloat = parseFloat(sueldo);

      let renta, porcentaje;
      if (sueldoFloat > 2500) {
        porcentaje = "25%";
        renta = sueldoFloat * 0.25;
      } else if (sueldoFloat >= 1000) {
        porcentaje = "18%";
        renta = sueldoFloat * 0.18;
      } else {
        porcentaje = "7%";
        renta = sueldoFloat * 0.07;
      }

      const sueldoNetoCalculado = sueldoFloat - renta;

      setPorcentajeRenta(`Porcentaje de Renta: ${porcentaje}`);
      setSueldoNeto(`Sueldo Neto: $${sueldoNetoCalculado.toFixed(2)}`);
    } else {
      setPorcentajeRenta(null);
      setSueldoNeto(null);
      alert("Por favor, complete los campos y presione Calcular Renta.");
    }
  };

  const handleNombreChange = (text) => {
    setNombre(text);
    setCambioin(true);
  };

  const handleApellidosChange = (text) => {
    setApellidos(text);
    setCambioin(true);
  };

  const handleSueldoChange = (text) => {
    setSueldo(text);
    setCambioin(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Calculadora de Renta</Text>
      <View style={styles.formulario}>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChangeText={handleNombreChange}
        />
        <TextInput
          style={styles.input}
          placeholder="Apellidos"
          value={apellidos}
          onChangeText={handleApellidosChange}
        />
        <TextInput
          style={styles.input}
          placeholder="Sueldo"
          value={sueldo}
          onChangeText={handleSueldoChange}
          keyboardType="numeric"
        />
        <Button title="Calcular Renta" onPress={calcularRenta} />
        <TouchableOpacity style={styles.botonGuardarResultado} onPress={guardarResultado}>
          <Text style={styles.textBotonGuardar}>Guardar resultado</Text>
          </TouchableOpacity>
      </View>
      {porcentajeRenta !== null && sueldoNeto !== null && (
        <View style={styles.resultadosContainer}>
          <Text style={styles.resultadosTitulo}>Resultados:</Text>
          <Text>Nombre: {nombre}</Text>
          <Text>Apellidos: {apellidos}</Text>
          <Text>Sueldo: ${sueldo}</Text>
          <Text>Renta: {porcentajeRenta}</Text>
          <Text>Sueldo Neto: ${sueldoNeto}</Text>
        </View>
      )}
      <Text style={styles.resultadosTitulo}>Resultados Guardados:</Text>
      <View>
        {resultadosGuardados.map((resultado) => (
          <View key={resultado.id} style={styles.resultadosGuardados}>
            <Text>Nombre: {resultado.nombre}</Text>
            <Text>Apellidos: {resultado.apellidos}</Text>
            <Text>Sueldo: ${resultado.sueldo.toFixed(2)}</Text>
            <Text>Renta: {resultado.porcentajeRenta}</Text>
            <Text>Sueldo Neto: ${resultado.sueldoNeto.toFixed(2)}</Text>
            <Button
              title="Eliminar"
              onPress={() => eliminarResultado(resultado.id)}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  formulario: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },botonGuardarResultado:{
    backgroundColor: 'green',
    paddingVertical: 10,
    marginTop:10,
    alignItems:"center"
  },textBotonGuardar:{
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15
  },
  resultadosContainer: {
    marginTop: 20,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resultadosTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  resultadosGuardados: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default App;
