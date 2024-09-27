import React from "react";
import doctesis from '../../assets/images/doc_tesis.png';
export default function Detalle() {

    return (
        <section>
            <div className="container mt-4">
                <h3>Un actor a tempo. El jazz como estímulo en la generación del ritmo a partir del uso de la máscara neutra de Jacques Lecoq como herramienta para entrenar el timing actoral</h3>
                <hr/>
            </div>
            <div className="container mt-3">
                <div className="row">
                    <div className="col-md-3 mt-4">
                        <img className="imgdocumento" src={doctesis} width={"240px"} height={"240px"}/>
                        <p class="mt-4">Ver y descargar documento</p>
                        <a href="#" class="documento">Texto completo (3.44MB)</a>
                        <p class="mt-2">Autor</p>
                        <p>Abad Abregu, Maria Isabel<br/>Arana Reyes Escobar, Diego Alejandro</p>
                    </div>
                    <div class="col-md-9 mt-4">
                        <h4>RESUMEN</h4>
                    <p class="resumen">El término “timing” es comúnmente utilizado en la formación actoral y el trabajo escénico; no obstante, su concepto no ha sido sistematizado bajo la denominación mencionada. Por ende, no se explica a los actores y actrices cómo llegar a obtenerlo. Por lo tanto, con esta investigación, se propone un concepto de timing y se busca sistematizar un entrenamiento del mismo, mediante el género musical jazz y lo propuesto por Jacques Lecoq en la máscara neutra. De esta manera, será necesario analizar el jazz como estímulo para el principio de ritmo trabajado en el uso de la máscara neutra como herramienta de entrenamiento para el timing actoral. Además, se contará con otras investigaciones que aportan al ámbito musical y al actoral. Entre las fuentes principales de este trabajo, resaltan Jacques Lecoq, quien expone su pedagogía con la máscara neutra; Henkjan Honing, que profundiza en el timing desde el campo de la música; y José Martínez, quien explica el jazz y sus principios swing y free playing. Para comprobar la hipótesis de esta investigación, se realizó un laboratorio presencial. En este, se utilizaron ejercicios de la pedagogía de Lecoq con la máscara neutra, y se incorporaron diversas piezas de los subgéneros del jazz a modo de estímulo sonoro. Como resultado, se obtuvo una evolución del sentido del timing en cada participante. Esto fue plasmado en el proceso del laboratorio y en la muestra final del mismo. Así, comprobamos que el free playing del jazz estimula el principio de ritmo trabajado por Lecoq. Pues, desarrolla una asociación entre referencias musicales y expresiones corporales, potenciando la creatividad activa de los y las participantes. De esta manera, se genera un entrenamiento en el cual el sentido musical y rítmico le brinda al intérprete un swing al accionar, y, por ende, un mejor manejo del timing.</p>
                    <div className="mt-2">
                        <h4>Temas</h4>
                        <p>
                            Lecop, Jacques-Crítica e interpretación
                            <br/>
                            Música en el arte-Perú-Lima
                            <br/>
                            Actuación-Rítmo
                            <br/>
                            Jazz
                        </p>
                    </div>
                    </div>
                </div>
                <hr/>
            </div>
        </section>
    )
}