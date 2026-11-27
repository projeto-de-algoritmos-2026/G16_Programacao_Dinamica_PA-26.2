# 🎓 UnB Grade Planner Pro — Programação Dinâmica (Dynamic Programming)

**Disciplina:** Projeto de Algoritmos  
**Módulo:** 4 - Programação Dinâmica (*Dynamic Programming*)  
**Professor:** Maurício Serrano  

Aplicação web interativa desenvolvida em **React + Vite** para auxiliar estudantes da Universidade de Brasília (UnB — FCTE/FGA) na montagem ótima de sua grade semestral. O projeto evolui o otimizador desenvolvido no Módulo 2 (*Greedy*), demonstrando na prática onde as abordagens ambiciosas falham diante de pesos e capacidades arbitrárias e resolvendo dois problemas clássicos de **Programação Dinâmica**: **Weighted Interval Scheduling** ($O(n \log n)$) e **Mochila 0-1 / Knapsack** ($\Theta(n \cdot W)$).

---

## 👥 Dupla 16

| Foto | Matrícula | Integrante | Responsabilidade Principal |
| :---: | :---: | :--- | :--- |
| <img src="https://github.com/Fofodoido.png" width="48" height="48" style="border-radius: 50%" alt="Rodrigo Henrique"/><br>[Rodrigo Donato](https://github.com/Fofodoido) | `241012374` | Rodrigo Henrique Donato de Souza | **Membro B:** Setup do projeto, núcleo algorítmico puro (`src/utils/dynamicProgramming.js`), ordenação manual, busca binária de $p(j)$, recorrências bottom-up, reconstrução (*backtracking*), comparativos gulosos e suite de testes automatizados (`test-algorithms.js`). |
| <img src="https://github.com/Daniellira540.png" width="48" height="48" style="border-radius: 50%" alt="Daniel de Oliveira"/><br>[Daniel Lira](https://github.com/Daniellira540) | `241025505` | Daniel de Oliveira Lira | **Membro A:** Modelagem do catálogo semestral da FGA/UnB (`src/utils/semesterData.js`), diagrama de Gantt ponderado, inspetor da tabela $M[j]/p(j)$, matriz visual interativa $M[i, w]$ com destaque de *backtracking* e interface reativa em Tailwind CSS v4. |

---

## 🎥 Apresentação em Vídeo

> 🔗 **Link do Vídeo:** [Clique aqui para assistir à apresentação no YouTube](COLE_O_LINK_DO_SEU_VIDEO_AQUI)

* **Duração:** ~4 a 5 minutos (100% na aplicação em execução)
* **Tópicos abordados:**
  1. Contextualização do problema de montagem de grade na UnB e por que a estratégia Gulosa do Módulo 2 deixa de ser ótima com pesos.
  2. Demonstração prática da Grade Horária Ponderada (*Weighted Interval Scheduling*) com presets que evidenciam a falha do Guloso.
  3. Análise visual da tabela $M[j]$, do vetor $p(j)$ e da reconstrução ótima na interface.
  4. Demonstração da Mochila 0-1 (*Knapsack*) com ajuste dinâmico de créditos $W$, comparação contra a heurística $v_i / w_i$ e inspeção visual da matriz $M[i, w]$ iluminando o *backtracking*.

---

## 🧠 Algoritmos Implementados e Fundamentação Teórica

O projeto toma como base o Capítulo 6 de **Kleinberg & Tardos** (*Algorithm Design*):

### 1. Weighted Interval Scheduling (Seção 6.1)
* **Objetivo:** Selecionar um subconjunto de disciplinas mutuamente compatíveis (sem choque de horário) que maximize a soma dos pesos/prioridades $v_j$.
* **Por que o Guloso falha:** Ordenar pelo término mais cedo (*Earliest Finish Time*) ignora os pesos — uma aula curta de peso $1$ pode bloquear uma disciplina prioritária de peso $999$.
* **Estrutura de PD:**
  1. Ordenam-se as disciplinas por horário de término crescente ($f_1 \le f_2 \le \dots \le f_n$) via MergeSort manual ($O(n \log n)$).
  2. Calcula-se $p(j)$ via **busca binária** ($O(n \log n)$): maior índice $i < j$ tal que $f_i \le s_j$ (ou $0$ caso inexistente).
  3. Preenche-se a tabela $M[0 \dots n]$ de forma *bottom-up* ($O(n)$):
     $$M[0] = 0, \qquad M[j] = \max\Big(v_j + M[p(j)],\; M[j - 1]\Big)$$
  4. Reconstrói-se o conjunto ótimo (`Find-Solution`) em $O(n)$ retrocedendo a partir de $j = n$.

### 2. Problema da Mochila 0-1 / Knapsack (Seção 6.4)
* **Objetivo:** Dado um teto inteiro de créditos/horas $W$ e $n$ disciplinas com custo $w_i$ e ganho acadêmico $v_i$, escolher o subconjunto de valor máximo respeitando $\sum w_i \le W$.
* **Por que o Guloso falha:** Escolher itens pela maior razão $v_i / w_i$ desperdiça capacidade residual e pode gerar soluções subótimas (ex.: $W = 11$ no caso clássico gera $35$ no guloso contra $40$ na PD).
* **Estrutura de PD:**
  1. Constrói-se a matriz $M[0 \dots n][0 \dots W]$ com subestrutura ótima em duas variáveis $(i, w)$:
     $$M[i, w] = \begin{cases} 0 & \text{se } i = 0 \\ M[i - 1, w] & \text{se } w_i > w \\ \max\Big(M[i - 1, w],\; v_i + M[i - 1, w - w_i]\Big) & \text{caso contrário} \end{cases}$$
  2. A reconstrução percorre a matriz de $M[n, W]$ até $i = 0$ em $O(n)$, registrando cada célula visitada para destaque visual na interface.
* **Complexidade Pseudopolinomial:** Tempo e espaço $\Theta(n \cdot W)$ (polinomial no valor numérico de $W$, não no número de bits de entrada).

---

## 📊 Análise de Complexidade

| Algoritmo | Paradigma | Melhor Caso | Pior Caso | Espaço Auxiliar |
| :--- | :--- | :---: | :---: | :---: |
| **Weighted Interval Scheduling** | PD Bottom-Up + Busca Binária | $\Omega(n \log n)$ | $O(n \log n)$ | $O(n)$ |
| **Reconstrução (`Find-Solution`)** | Backtracking sobre $M[j]$ | $\Omega(n)$ | $O(n)$ | $O(n)$ |
| **Mochila 0-1 (Knapsack)** | PD Tabular 2D | $\Theta(n \cdot W)$ | $\Theta(n \cdot W)$ | $\Theta(n \cdot W)$ |
| **Comparativos Gulosos** | Greedy (contraste) | $\Omega(n \log n)$ | $O(n \log n)$ | $O(n)$ |

Onde $n$ é a quantidade de disciplinas/atividades avaliadas e $W$ é a capacidade máxima inteira de créditos/horas.

---

## 🛠️ Tecnologias Utilizadas

* **React 19:** Interface declarativa e gerenciamento de estado reativo.
* **Vite:** Servidor de desenvolvimento e empacotamento rápido.
* **Tailwind CSS v4:** Estilização utilitária responsiva.
* **JavaScript Moderno (ES6+):** Implementação manual dos algoritmos de PD, ordenação e busca binária sem bibliotecas externas.
* **Node.js:** Ambiente para execução dos testes unitários automatizados.

---

## 📂 Estrutura de Diretórios

```text
G16_Programacao_Dinamica_PA-26.2/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── ComparisonBanner.jsx    # Cards comparativos PD vs. Algoritmo Guloso
│   │   ├── KnapsackPlanner.jsx     # Slider de capacidade W e Matriz DP M[i, w] interativa
│   │   └── WeightedSchedule.jsx    # Gantt ponderado e tabela M[j] / p(j)
│   ├── utils/
│   │   ├── dynamicProgramming.js   # MergeSort, busca binária p(j), WIS, Knapsack 0-1 e Gulosos
│   │   └── semesterData.js         # Catálogo de disciplinas da FGA-UnB e presets de teste
│   ├── App.jsx                     # Navegação entre os dois painéis de Programação Dinâmica
│   ├── index.css                   # Configuração do Tailwind CSS v4
│   └── main.jsx
├── test-algorithms.js              # Suite de testes unitários e casos de borda
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Instalação e Execução

### Pré-requisitos

* **Node.js** (versão 18 ou superior)
* **npm** (ou **pnpm** / **yarn**)

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/projeto-de-algoritmos-2026/G16_Programacao_Dinamica_PA-26.2.git
   ```

2. **Acesse a pasta do projeto:**
   ```bash
   cd G16_Programacao_Dinamica_PA-26.2
   ```

3. **Instale as dependências:**
   ```bash
   npm install
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

5. **Acesse no navegador:**
   Abra [http://localhost:5173](http://localhost:5173) para interagir com o **UnB Grade Planner Pro**.

6. **Execute a suite de testes automatizados:**
   ```bash
   node test-algorithms.js
   ```

---

## 🧪 Casos de Borda e Validações Algorítmicas

A suite `test-algorithms.js` valida formalmente a corretude dos dois algoritmos em cenários clássicos e extremos:

1. **Armadilha do Algoritmo Guloso (Slide 7):** Confirma que, diante de um intervalo curto de peso $1$ competindo com um intervalo longo de peso $999$, o Guloso (EFT) obtém apenas $1$ enquanto a PD encontra o ótimo global $999$.
2. **Predecessores $p(j)$ via Busca Binária (Slide 8):** Verifica nos 8 intervalos clássicos do livro que $p(2) = 0$, $p(7) = 3$ e $p(8) = 5$, além da igualdade entre a soma reconstruída e $M[n]$.
3. **Intervalos Adjacentes e Horários `"HH:MM"`:** Garante que uma disciplina terminando às `10:00` e outra iniciando às `10:00` são compatíveis ($f_i \le s_j$).
4. **Exemplo Clássico da Mochila 0-1 (Slides 24–29, $W = 11$):** Confirma que o Guloso por razão $v_i / w_i$ obtém $35$ ($\{5, 2, 1\}$), enquanto a PD preenche $M[5][11] = 40$ e o *backtracking* reconstrói exatamente $\{3, 4\}$.
5. **Casos Degenerados e Limites:** Valida retorno seguro sem erros para listas vazias (`[]`), lista unitária, capacidade $W = 0$ e cenários onde todos os itens excedem $W$.
