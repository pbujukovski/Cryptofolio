using Cryptofolio.Data;
using Cryptofolio.Models;
using Cryptofolio.Services;
using Cryptofolio.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Deltas;
using Microsoft.AspNetCore.OData.Formatter;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Microsoft.EntityFrameworkCore;
using System.Collections;
using System.Linq;

namespace Cryptofolio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionsController : ODataController
    {

        private readonly ApplicationDbContext _context;
        private readonly IUserAuthService _userAuthService;

        public TransactionsController(ApplicationDbContext context, IUserAuthService userAuthService)
        {
            _context = context;
            _userAuthService = userAuthService;
        }

        // GET: api/Transactions
        [EnableQuery]
        [HttpGet("/odata/Transactions")]
        /*    public IQueryable<TransactionDTO> Get()
            {
                    List<TransactionDTO> transactions = _context.Transactions
                    .Include(t => t.)
                        .ThenInclude(ft => ft.FinanceTransactionBuy)
                    .Include(t => t.FinanceTransaction)
                        .ThenInclude(ft => ft.FinanceTransactionSell)
                    .Include(t => t.TransferTransaction)
                        .ThenInclude(tt => tt.TransferTransactionIn)
                    .Include(t => t.TransferTransaction)
                        .ThenInclude(tt => tt.TransferTransactionOut);

                return transactions.AsQueryable();
            }*/


        public  async Task<ActionResult<List<TransactionDTO>>> GetTransactionsAsync()
        {
            if (_context.Transactions == null && _userAuthService.getCurrentUserId() == null)
            {
                return NotFound();
            }
            else if (_context.Transactions != null && _userAuthService.getCurrentUserId() != null)
            {
                var transaction12 = _context.Set<Transaction>().ToList();
                var transaction123 = _context.Set<Transaction>().Where(cs => cs.ApplicationUserId == _userAuthService.getCurrentUserId()).ToList();

                List<TransactionDTO> transaction1 = _context.Set<Transaction>().Where(cs => cs.ApplicationUserId == _userAuthService.getCurrentUserId()).Select(transactions1 => new TransactionDTO(transactions1)).ToList();
                List<Transaction> transactions = await _context.Transactions.ToListAsync();

                List<TransactionDTO> transactionDTOs = new List<TransactionDTO>();
                foreach(Transaction transaction in transactions)
                {
                    if(transaction is FinanceTransactionBuy)
                    {
                        FinanceTransactionBuyDTO  financeTransactionBuyDTO = new FinanceTransactionBuyDTO(transaction as FinanceTransactionBuy);
                        transactionDTOs.Add(financeTransactionBuyDTO); 
                    }
                }
                var test = 0;
                return Ok(transactionDTOs);
            }
            else return BadRequest();
        }

        // GET: api/Transactions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Transaction>> GetTransaction(int id)
        {
            if (_context.Transactions == null)
            {
                return NotFound();
            }
            var transaction = await _context.Transactions.FindAsync(id);

            if (transaction == null)
            {
                return NotFound();
            }

            return transaction;
        }

        // PUT: api/Transactions/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [EnableQuery]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTransaction(int id, [FromODataBody] TransactionDTO transactionDTO)
        {
            Transaction? transaction= await _context.Transactions.FirstOrDefaultAsync(x => x.Id == id);

            if (transaction == null)
            {
                if (id != transaction.Id)
                {
                    return BadRequest();
                }
                transaction.Id = transactionDTO.Id;

                _context.Entry(transaction).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!TransactionExists(id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

            }
            return NoContent();
        }

        [HttpPatch("{key}")]
        public async Task<IActionResult> Patch([FromODataUri] int key, Delta<TransactionDTO> transactionDTO)
        {
            if (_context.Transactions == null)
            {
                return Problem("Entity set 'ApplicationDbContext.Transactions'  is null.");
            }
            if (_userAuthService.getCurrentUserId() is null)
            {
                return Problem("Access denied");
            }

            var entity = await _context.Transactions.FindAsync(key);

            if (entity == null)
            {
                return NotFound();
            }


            Delta<Transaction> deltaTransaction = TransactionDTO.toDeltaTransaction(transactionDTO);

            deltaTransaction.Patch(entity);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TransactionExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return Updated(entity);

        }



        // DELETE: api/Transactions/5
        [EnableQuery]
        [HttpDelete("/odata/Transactions({id})")]
        public async Task<IActionResult> DeleteTransaction(int id)
        {
            if (_context.Transactions == null)
            {
                return NotFound();
            }
            var transaction = await _context.Transactions.FindAsync(id);
            if (transaction == null)
            {
                return NotFound();
            }

            _context.Transactions.Remove(transaction);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TransactionExists(int id)
        {
            return (_context.Transactions?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
